//* <------------------ UPDATE ITEM WORKSHOP STATUS

import { ServiceOrders } from '../ServiceOrders'
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
}
export const onWorkshopRepairPending = async ({
  storeId,
  itemId,
  orderId,
  failDescription,
  isExternalRepair
}) => {
  try {
    if (isExternalRepair) {
      ServiceOrders.update(orderId, {
        ['workshopFlow.pendingAt']: new Date(),
        ['workshopFlow.pickedUpAt']: null,
        ['workshopFlow.startedAt']: null,
        ['workshopFlow.finishedAt']: null,
        ['workshopFlow.deliveredAt']: null,
        workshopStatus: 'pending',
        failDescription
      })
    } else {
      ServiceStoreItems.update({
        itemId,
        storeId,
        itemData: {
          //* ['workshopFlow.shouldPickupAt']: new Date(), <---- new Date(),//* this is not necessary for RENT items
          ['repairInfo.failDescription']: failDescription,
          ['workshopFlow.pickedUpAt']: null,
          ['workshopFlow.startedAt']: null,
          ['workshopFlow.finishedAt']: null,
          ['workshopFlow.deliveredAt']: null,
          workshopStatus: 'pending'
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const onWorkshopRepairPickUp = async ({
  storeId,
  itemId,
  orderId,
  isExternalRepair,
  failDescription
}) => {
  try {
    if (isExternalRepair) {
      ServiceOrders.update(orderId, {
        ['workshopFlow.pickedUpAt']: new Date(),
        ['workshopFlow.startedAt']: null,
        ['workshopFlow.finishedAt']: null,
        ['workshopFlow.deliveredAt']: null,
        workshopStatus: 'pending',
        failDescription
      })
    } else {
      ServiceStoreItems.update({
        itemId,
        storeId,
        itemData: {
          ['workshopFlow.pickedUpAt']: new Date(),
          ['workshopFlow.startedAt']: null,
          ['workshopFlow.finishedAt']: null,
          ['workshopFlow.deliveredAt']: null,
          workshopStatus: 'pending',
          failDescription
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const onWorkshopRepairStart = async ({
  storeId,
  itemId,
  orderId,
  isExternalRepair
}) => {
  try {
    if (isExternalRepair) {
      ServiceOrders.update(orderId, {
        ['workshopFlow.startedAt']: new Date(),
        ['workshopFlow.finishedAt']: null,
        ['workshopFlow.deliveredAt']: null,
        workshopStatus: 'inProgress'
      })
    } else {
      ServiceStoreItems.update({
        itemId,
        storeId,
        itemData: {
          ['workshopFlow.startedAt']: new Date(),
          ['workshopFlow.finishedAt']: null,
          ['workshopFlow.deliveredAt']: null,
          workshopStatus: 'inProgress'
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const onWorkshopRepairFinish = async ({
  storeId,
  itemId,
  orderId,
  isExternalRepair
}: WorkshopActionProps) => {
  try {
    if (isExternalRepair) {
      console.log('finish order', { orderId })
      ServiceOrders.update(orderId, {
        'workshopFlow.finishedAt': new Date(),
        'workshopFlow.deliveredAt': null,
        workshopStatus: 'finished'
      })
    } else {
      console.log('finish item')
      ServiceStoreItems.update({
        itemId,
        storeId,
        itemData: {
          ['workshopFlow.finishedAt']: new Date(),
          ['workshopFlow.deliveredAt']: null,
          workshopStatus: 'finished'
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
export const onWorkshopRepairDelivered = async ({
  storeId,
  itemId,
  orderId,
  isExternalRepair
}) => {
  try {
    if (isExternalRepair) {
      ServiceOrders.update(orderId, {
        ['workshopFlow.deliveredAt']: new Date(),
        workshopStatus: 'finished'
      })
    } else {
      ServiceStoreItems.update({
        itemId,
        storeId,
        itemData: {
          ['workshopFlow.deliveredAt']: new Date(),
          workshopStatus: 'finished'
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
