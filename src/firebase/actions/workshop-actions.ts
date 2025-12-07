//* <------------------ UPDATE ITEM WORKSHOP STATUS

import {
	onRepairCancelPickup,
	onRepairDelivery,
	onRepairFinish,
	onRepairPickup,
	onRepairStart
} from '../../libs/order-actions'
import { ServiceItemHistory } from '../ServiceItemHistory'
import { ServiceStoreItems } from '../ServiceStoreItems'

//* REPAIR ITEMS/ORDERS STEPS
//*      1. PENDING TO PICK UP     <---- shouldPickUp
//*      2. IN QUEUE TO REPAIR     <---- pending
//*      3. IN PROGRESS OF REPAIR  <---- inProgress
//*      4. PENDING TO DELIVERED   <---- finished
//*      5. DELIVERED              <---- delivered
/**
 *
 * This function mark item/order as pending to pick up, this should be accompanied with a failDescription
 * @param failDescription describes the problem or failure that is present
 */

export type WorkshopActionProps = {
	storeId?: string
	itemId?: string
	orderId?: string
	isExternalRepair?: boolean
	failDescription?: string
	userId: string
}

/**
 *
 * @param param0 Mark as PENDING TO PICK UP an item or order
 */
export const onWorkshopRepairPending = async ({
	storeId,
	itemId,
	orderId,
	failDescription,
	isExternalRepair,
	userId
}: WorkshopActionProps) => {
	try {
		if (isExternalRepair) {
			onRepairCancelPickup({
				orderId,
				userId,
				storeId
			})
		} else {
			// onMarkItemAsNeedToBeFixed
		}
	} catch (error) {
		console.error(error)
	}
}

/**
 *
 * @param param0 Mark as PICKED UP and ready to start Repair an item or order
 */
export const onWorkshopRepairPickUp = async ({
	storeId,
	itemId,
	orderId,
	isExternalRepair,
	failDescription,
	userId
}: WorkshopActionProps) => {
	try {
		if (isExternalRepair) {
			// FIXME: pickup repair should start repair
			// onRepairPickup({
			//   orderId,
			//   userId,
			//   storeId,
			//   failDescription
			// })
			onRepairStart({
				orderId,
				userId,
				storeId
			})
		} else {
			ServiceItemHistory.addEntry({
				storeId,
				itemId,
				entry: {
					type: 'workshop',
					variant: 'repair_picked_up'
				}
			})
			ServiceStoreItems.update({
				itemId,
				storeId,
				itemData: {
					['workshopFlow.pickedUpAt']: new Date(),
					['workshopFlow.startedAt']: null,
					['workshopFlow.finishedAt']: null,
					['workshopFlow.deliveredAt']: null,
					workshopStatus: 'pickedUp',
					failDescription
				}
			})
		}
	} catch (error) {
		console.error(error)
	}
}
/**
 *
 * @param param0 Mark as REPAIR STARTED  to start Repair an item or order
 */
export const onWorkshopRepairStart = async ({
	storeId,
	itemId,
	orderId,
	isExternalRepair,
	failDescription,
	userId
}: WorkshopActionProps) => {
	try {
		if (isExternalRepair) {
			onRepairStart({
				orderId,
				userId,
				storeId
			})
		} else {
			ServiceItemHistory.addEntry({
				storeId,
				itemId,
				entry: {
					type: 'workshop',
					variant: 'repair_started'
				}
			})
			ServiceStoreItems.update({
				itemId,
				storeId,
				itemData: {
					['workshopFlow.startedAt']: new Date(),
					['workshopFlow.finishedAt']: null,
					['workshopFlow.deliveredAt']: null,
					workshopStatus: 'started',
					failDescription
				}
			})
		}
	} catch (error) {
		console.error(error)
	}
}
/**
 *
 * @param param0 Mark as REPAIR FINISHED  to start Repair an item or order
 */
export const onWorkshopRepairFinish = async ({
	storeId,
	itemId,
	orderId,
	isExternalRepair,
	userId
}: WorkshopActionProps) => {
	try {
		if (isExternalRepair) {
			onRepairFinish({
				orderId,
				userId,
				storeId
			})
		} else {
			ServiceStoreItems.update({
				itemId,
				storeId,
				itemData: {
					['workshopFlow.finishedAt']: new Date(),
					['workshopFlow.deliveredAt']: null,
					workshopStatus: 'finished'
				}
			}).then(() => {
				ServiceItemHistory.addEntry({
					storeId,
					itemId,
					entry: {
						type: 'workshop',
						variant: 'repair_finished'
					}
				})
			})
		}
	} catch (error) {
		console.error(error)
	}
}

export const onWorkshopDeliveryRepair = async ({
	storeId,
	itemId,
	orderId,
	isExternalRepair,
	failDescription,
	userId
}: WorkshopActionProps) => {
	try {
		if (isExternalRepair) {
			onRepairDelivery({
				orderId,
				userId,
				storeId
			})
		} else {
			ServiceItemHistory.addEntry({
				storeId,
				itemId,
				entry: {
					type: 'workshop',
					variant: 'repair_delivered'
				}
			})
			ServiceStoreItems.update({
				itemId,
				storeId,
				itemData: {
					['workshopFlow.pickedUpAt']: new Date(),
					['workshopFlow.startedAt']: null,
					['workshopFlow.finishedAt']: null,
					['workshopFlow.deliveredAt']: new Date(),
					workshopStatus: 'delivered',
					failDescription
				}
			})
		}
	} catch (error) {
		console.error(error)
	}
}

export const onReportItem = async ({
	itemId,
	storeId,
	failDescription
}: {
	itemId: string
	storeId: string
	failDescription: string
}) => {
	return ServiceStoreItems.update({
		itemId,
		storeId,
		itemData: {
			['repairDetails.failDescription']: failDescription,
			['workshopFlow.pendingAt']: new Date(),
			workshopStatus: 'pending',
			needFix: true
		}
	})
		.then(() => {
			ServiceItemHistory.addEntry({
				storeId,
				itemId,
				entry: {
					type: 'report',
					content: failDescription
				}
			}).catch(console.error)
		})
		.catch(console.error)
}

export const onFixItem = async ({
	itemId,
	storeId,
	fixDescription
}: {
	itemId: string
	storeId: string
	fixDescription: string
}) => {
	return ServiceStoreItems.update({
		itemId,
		storeId,
		itemData: {
			['workshopFlow.finishedAt']: new Date(),
			['workshopFlow.deliveredAt']: null,
			workshopStatus: 'finished',
			needFix: false
		}
	}).then(() => {
		ServiceItemHistory.addEntry({
			storeId,
			itemId,
			entry: {
				type: 'workshop',
				variant: 'repair_finished',
				content: fixDescription
			}
		})
	})
}
