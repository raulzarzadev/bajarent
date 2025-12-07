import { limit, serverTimestamp, where } from 'firebase/firestore'
import type { GetItemsOps } from '../../firebase/firebase.CRUD'
import { FirebaseGenericService } from '../../firebase/genericService'
import { createUUID } from '../../libs/createId'
import { planeDate, startDate } from '../../libs/utils-date'
import type { CurrentWorkType, NewWorkUpdate } from './CurrentWorkType'

class ServiceCurrentWorkClass extends FirebaseGenericService<CurrentWorkType> {
	constructor() {
		super('currentWork_v2')
	}
	async getByStore(storeId: string, ops?: GetItemsOps) {
		return this.getItems([where('storeId', '==', storeId)], ops)
	}

	async getByDate({ date = new Date(), storeId }: { date?: Date; storeId: string }) {
		const planeDateOfToday = planeDate(date)
		return this.findOne([
			where('storeId', '==', storeId),
			where('planeDate', '==', planeDateOfToday),
			limit(1)
		])
	}

	async listenTodayByStore(storeId: string, callback: (data: CurrentWorkType[]) => void) {
		const planeDateOfToday = planeDate(new Date())
		return this.listenMany(
			[where('storeId', '==', storeId), where('planeDate', '==', planeDateOfToday), limit(1)],
			res => callback(res?.[0] || null)
		)
	}

	async addWork({
		storeId,
		work,
		userId
	}: {
		storeId: string
		work: NewWorkUpdate
		userId: string
	}) {
		const doc = await this.getByDate({ storeId })

		const NEW_DATE = new Date()
		const updateId = createUUID({ length: 10 }) //*replace "."->":" avoid problems to serialize and update values in redux
		const newUpdate = {
			...work,
			id: updateId,
			createdBy: userId,
			createdAt: serverTimestamp()
		}
		if (doc) {
			return await this.update(doc.id, {
				updates: {
					...doc.updates,
					[newUpdate.id]: newUpdate
				}
			}).then(() => {
				return { ...newUpdate }
			})
		} else {
			const newDocId = createUUID({ length: 22 })

			return await this.set(newDocId, {
				storeId,
				date: startDate(NEW_DATE),
				planeDate: planeDate(NEW_DATE),
				updates: {
					[newUpdate.id]: newUpdate
				}
			}).then(() => {
				return { ...newUpdate }
			})
		}
	}
}

export const ServiceCurrentWork = new ServiceCurrentWorkClass()
