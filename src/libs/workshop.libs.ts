import { isToday } from 'date-fns'
import type ItemType from '../types/ItemType'
import type { ItemExternalRepairProps } from '../types/ItemType'
import type OrderType from '../types/OrderType'
import { type ContactType, type OrderQuoteType, order_status } from '../types/OrderType'
import type { CategoryType } from '../types/RentItem'
import type { SectionType } from '../types/SectionType'
import asDate from './utils-date'

export const splitItems = ({ items = [] }: { items: Partial<ItemExternalRepairProps>[] }) => {
	if (!items.length)
		return {
			needFix: [],
			inProgress: [],
			finished: [],
			shouldPickup: []
		}

	const needFix = items.filter(
		item => item.needFix && (item.workshopStatus === 'pending' || item.status === 'pickedUp')
	)

	const inProgress = items.filter(item => item.workshopStatus === 'started')
	const finished = items.filter(item => !item.needFix && item.workshopStatus === 'finished')
	const shouldPickup = items.filter(item => item.workshopStatus === 'pending')
	return {
		needFix,
		inProgress,
		finished,
		shouldPickup
	}
}

export const formatItems = (
	items: Partial<ItemType>[],
	categories: Partial<CategoryType>[],
	sections: SectionType[]
) => {
	return items?.map(item => {
		const workshopStatus = ['inProgress', 'pending'].includes(item?.workshopStatus)
			? 'pickedUp'
			: item?.workshopStatus

		return {
			...item,
			id: item?.id,
			categoryName: categories?.find(cat => cat.id === item?.category)?.name || '',
			assignedSectionName: sections?.find(sec => sec.id === item?.assignedSection)?.name || '',
			needFix: !!item?.needFix,
			isRented: !!(item?.status === 'rented'),
			isPickedUp: !!(item?.status === 'pickedUp'),
			checkedInInventory: isToday(asDate(item?.lastInventoryAt)),
			workshopFlow: item?.workshopFlow,
			workshopStatus: workshopStatus || 'pickedUp'
		}
	})
}

export const formatItemsFromRepair = ({
	repairOrders,
	storeSections
}: {
	repairOrders: Partial<OrderType>[]
	categories: Partial<CategoryType>[]
	storeSections: SectionType[]
}): Partial<ItemType>[] => {
	const items: Partial<ItemExternalRepairProps>[] = repairOrders.map(order => {
		const workshopStatus =
			//@ts-expect-error
			order.workshopStatus === 'inProgress' ? 'pickedUp' : order.workshopStatus

		const needFix =
			order.status === order_status.REPAIRING ||
			order.status === order_status.AUTHORIZED ||
			order.status === order_status.PICKED_UP

		const item = order.item
		const failDescription = item?.failDescription || order?.repairInfo || ''
		const formattedItem = {
			id: order?.id,
			needFix,
			brand: item?.brand || '',

			//*----> this names changes to adapt to the new structure
			// serial: item?.serial || '',
			// number: String(order.folio) || '',
			// categoryName:
			//   categories.find((cat) => cat.id === item?.categoryId)?.name || '',
			// serial: item?.serial || '',
			// number: String(order.folio) || '',
			categoryName: String(order?.folio),
			number: item?.serial || '',
			serial: order?.fullName,
			//*<----- this names changes to adapt to the new structure

			assignedSectionName: storeSections?.find(sec => sec.id === order.assignToSection)?.name || '',
			workshopStatus: workshopStatus || 'pending',
			workshopFlow: order?.workshopFlow || {},
			failDescription,
			repairDetails: {
				failDescription,
				quotes: (order?.quotes as OrderQuoteType[]) || [],
				clientName: order?.fullName || '',
				contacts: [
					{ name: '', phone: order.phone, isOriginal: true },
					...((order?.contacts as ContactType[]) || [])
				],
				address:
					`${order?.neighborhood || ''} ${order?.address || ''} ${order?.references || ''}` || '',
				location: order?.coords
					? `https://maps.google.com/?${order?.coords}`
					: order?.location || ''
			},
			isExternalRepair: true,
			orderId: order?.id,
			scheduledAt: asDate(order?.scheduledAt)
		}

		return formattedItem
	})
	return items
}
