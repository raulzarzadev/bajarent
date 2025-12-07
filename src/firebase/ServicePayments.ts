import { where, documentId, limit, orderBy, QueryConstraint } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import PaymentType from '../types/PaymentType'
import { subDays } from 'date-fns'
import { RetirementType } from '../components/FormRetirement'
import { GetItemsOps } from './firebase.CRUD'
import { ServiceOrders } from './ServiceOrders'
class ServicePaymentsClass extends FirebaseGenericService<PaymentType> {
	constructor() {
		super('payments')
	}

	async orderPayment(payment: PaymentType) {
		return this.create({
			...payment,
			orderId: payment.orderId,
			storeId: payment.storeId,
			method: payment.method,
			reference: payment.reference,
			amount: parseFloat(`${payment.amount || 0}`)
		}).then(async res => {
			if (payment.orderId) {
				ServiceOrders.update(payment.orderId, {
					paidAt: new Date(),
					paidBy: payment.createdBy || null
				}).catch(console.error)
				return res
			} else {
				console.error('orderId missing')
				return res
			}
		})
	}

	async getByStore(storeId: string, ops?: GetItemsOps) {
		return this.getItems([where('storeId', '==', storeId)], ops)
	}

	async getByOrder(orderId: string) {
		return this.getItems([where('orderId', '==', orderId)])
	}

	listenByOrder(orderId: string, callback: (items: PaymentType[]) => void, { count = 10 } = {}) {
		return this.listenMany(
			[where('orderId', '==', orderId), orderBy('createdAt', 'desc'), limit(count)],
			callback
		)
	}
	//#region list
	list = async (list: string[] = []) => {
		if (!list.length) return []
		const MAX_BATCH_SIZE = 30 // Ajustar según las limitaciones de la base de datos/API
		const batches = []
		for (let i = 0; i < list.length; i += MAX_BATCH_SIZE) {
			batches.push(list.slice(i, i + MAX_BATCH_SIZE))
		}
		const results = []
		for (const batch of batches) {
			const batchResults = await this.getItems([where(documentId(), 'in', batch)])
			results.push(...batchResults)
		}
		return results
		if (!list.length) return []
		return this.getItems([where(documentId(), 'in', list)])
	}
	//#endregion

	//#region getInList
	getInList = async ({
		list = [],
		moreFilters = [],
		field = ''
	}: {
		list: string[]
		field: string
		moreFilters?: QueryConstraint[]
	}): Promise<PaymentType[]> => {
		if (!list.length) return []
		const MAX_BATCH_SIZE = 30 // Ajustar según las limitaciones de la base de datos/API
		const batches = []
		for (let i = 0; i < list.length; i += MAX_BATCH_SIZE) {
			batches.push(list.slice(i, i + MAX_BATCH_SIZE))
		}
		// const results = []
		const promises = batches.map(batch =>
			this.getItems([where(field, 'in', batch), ...moreFilters]).catch(error => {
				console.error('Error getting batch:', error)
				return []
			})
		)
		try {
			const results = await Promise.all(promises)
			return results.flat()
		} catch (error) {
			console.error('Error getting batch:', error)
		}
	}

	async getToday(storeId: string) {
		return this.findMany([
			where('storeId', '==', storeId),
			where('createdAt', '>=', new Date(new Date().setHours(0, 0, 0, 0))),
			where('createdAt', '<=', new Date(new Date().setHours(23, 59, 59, 999)))
		])
	}

	async getLast(storeId: string, { count = 10, days = 0 }) {
		if (days) {
			return this.getItems([
				where('storeId', '==', storeId),
				where('createdAt', '>=', new Date(subDays(new Date(), days).setHours(23, 59, 59, 999))),

				orderBy('createdAt', 'desc')
			])
		}
		return this.getItems([
			where('storeId', '==', storeId),
			limit(count),
			orderBy('createdAt', 'desc')
		])
	}

	async retirement(retirement: RetirementType) {
		return this.create({
			type: retirement.type,
			amount: parseFloat(`${retirement.amount || 0}`),
			description: retirement.description,
			sectionId: retirement.sectionId,
			method: 'cash',
			isRetirement: true,
			storeId: retirement.storeId
		})
	}

	//* FIXME - here you should get the payments in the orders that are assigned here
	async getBySections({
		storeId,
		sections,
		fromDate,
		toDate
	}: {
		storeId: string
		sections: string[]
		fromDate: Date
		toDate: Date
	}) {
		return this.getItems([
			where('storeId', '==', storeId),
			where('sectionId', 'in', sections),
			where('createdAt', '>=', fromDate),
			where('createdAt', '<=', toDate)
		])
	}
	// Agrega tus métodos aquí
	async customMethod() {
		// Implementa tu método personalizado
	}
	async getByOrderAndDay({ orderId, date }: { orderId: string; date: Date }) {
		return this.getItems([
			where('orderId', '==', orderId),
			where('createdAt', '>=', date.setHours(0, 0, 0, 0)),
			where('createdAt', '<=', date.setHours(23, 59, 59, 999))
		])
	}

	//#region getBetweenDates
	async getBetweenDates(
		{
			fromDate,
			toDate,
			storeId,
			userId,
			inOrders
		}: {
			fromDate: Date
			toDate: Date
			storeId: string
			userId?: string
			inOrders?: string[]
		},
		ops?: GetItemsOps
	) {
		let filters = [
			where('storeId', '==', storeId),
			where('createdAt', '>=', fromDate),
			where('createdAt', '<=', toDate)
		]
		if (userId) filters.push(where('createdBy', '==', userId))
		if (inOrders.length) {
			const request = await this.getInList({
				list: inOrders,
				field: 'orderId',
				moreFilters: filters
			})
			return request
		}
		return this.getItems(filters, ops)
	}
	async listenBetweenDates({
		fromDate,
		toDate,
		storeId,
		userId,
		callback
	}: {
		fromDate: Date
		toDate: Date
		storeId: string
		userId?: string
		callback: (items: PaymentType[]) => void
	}) {
		let filters = [
			where('storeId', '==', storeId),
			where('createdAt', '>=', fromDate),
			where('createdAt', '<=', toDate)
		]
		if (userId) filters.push(where('createdBy', '==', userId))

		this.listenMany(filters, callback)
		// Implementa tu método personalizado
	}
}

export const ServicePayments = new ServicePaymentsClass()
