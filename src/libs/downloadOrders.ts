import { where } from 'firebase/firestore'
import { json2csv } from 'json-2-csv'
import JSZip from 'jszip'
import { getUserName } from '../components/SpanUser'
import dictionary from '../dictionary'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import { ServiceBalances as ServiceBalance3 } from '../firebase/ServiceBalances3'
import { ServiceOrders } from '../firebase/ServiceOrders'
import type OrderType from '../types/OrderType'
import type { ContactType } from '../types/OrderType'
import type StoreType from '../types/StoreType'
import { currentRentPeriod } from './orders'
import asDate, { dateFormat } from './utils-date'

export const rentsCSVFile = async ({
	storeId,
	storeStaff,
	type = 'in-rent'
}: {
	storeId: string
	storeStaff: StoreType['staff']
	type: 'in-rent' | 'all-rents'
}) => {
	let filters = []
	if (type === 'in-rent') {
		filters = [where('type', '==', 'RENT'), where('status', '==', 'DELIVERED')]
	}
	if (type === 'all-rents') {
		filters = [where('type', '==', 'RENT')]
	}

	const jsonRes = await ServiceOrders.findMany([where('storeId', '==', storeId), ...filters]).catch(
		error => {
			console.log('error', error)
		}
	)
	return json2csv(formatRentsToCSV(jsonRes, storeStaff))
}
export const balanceJSONFile = async ({ storeId }) => {
	const jsonRes = await getDateBalanceV2({
		storeId,
		fromDate: new Date(),
		toDate: new Date(),
		storeSections: []
	})

	return jsonRes
}

export const onDownloadBackup = async ({ storeId, storeStaff, storeName }) => {
	const rentsPromise = rentsCSVFile({
		storeId,
		storeStaff,
		type: 'all-rents'
	})
	// const balancePromise = balanceJSONFile({
	//   storeId
	// })
	const balancePromise = getDateBalanceV3({
		storeId,
		fromDate: new Date(),
		toDate: new Date()
	})

	return await Promise.all([rentsPromise, balancePromise])
		.then(([rentsData, balanceData]) => {
			if (!rentsData || !balanceData) {
				throw new Error('Error downloading data')
			}
			const zip = new JSZip()
			zip.file(`orders-${dateFormat(new Date(), 'ddMMMyy')}.csv`, rentsData)
			zip.file(`balance-${dateFormat(new Date(), 'ddMMMyy')}.json`, JSON.stringify(balanceData))

			zip.generateAsync({ type: 'blob' }).then(content => {
				const downloadLink = document.createElement('a')
				downloadLink.href = URL.createObjectURL(content)
				downloadLink.setAttribute(
					'download',
					`${storeName}-${dateFormat(new Date(), 'ddMMMyy')}.zip`
				)
				document.body.appendChild(downloadLink)
				downloadLink.click()
				document.body.removeChild(downloadLink)
			})
		})
		.catch(error => {
			console.log('error', error)
		})
}

export const getDateBalanceV2 = async ({ storeId, fromDate, toDate, storeSections }) => {
	return await ServiceBalances.createV2(storeId, {
		fromDate,
		toDate,
		notSave: true,
		storeSections
	}).catch(e => console.error(e))
}

export const getDateBalanceV3 = async ({ storeId, fromDate, toDate }) => {
	return await ServiceBalance3.createV3(storeId, {
		fromDate,
		toDate
	}).catch(e => console.error(e))
}

export const formatRentsToCSV = (rents, storeStaff: StoreType['staff']) => {
	const formatDate = date => (date ? dateFormat(asDate(date), 'yyyy-MM-dd HH:mm:ss') : '')
	const formatUser = userId => getUserName(storeStaff, userId) || ''
	return rents.map((rent: Partial<OrderType>) => {
		const contacts = (rent?.contacts as ContactType[]) || []
		return {
			type: dictionary(rent?.type) || '',
			status: dictionary(rent?.status) || '',
			folio: rent?.folio || '',
			note: rent?.note || '',
			items:
				rent?.items?.map(item => `${item?.number || ''} ${item?.serial || ''}`).join(', ') ||
				'' ||
				'',
			fullName: rent?.fullName || '',
			//email: rent?.email || '',
			phone:
				`${rent?.phone} ${contacts?.length > 0 ? ', ' : ''}${contacts
					?.map(c => `${c?.phone || ''}`)
					.join(', ')}` || '',
			address: rent?.address || '',
			neighborhood: rent?.neighborhood || '',
			coords: rent?.coords || '',
			time: currentRentPeriod(rent) || '',

			deliveredAt: formatDate(rent.deliveredAt) || '',
			expireAt: formatDate(rent.expireAt) || '',
			// pickedUpAt: formatDate(rent.pickedUpAt) || '',
			// pickedUpBy: formatUser(rent.pickedUpBy) || '',
			deliveredBy: formatUser(rent.deliveredBy) || '',
			createdBy: formatUser(rent.createdBy) || '',
			createdAt: formatDate(rent.createdAt) || ''
		}
	})
}
