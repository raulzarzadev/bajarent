import ItemType from '../../types/ItemType'
import { ItemHistoryType, ServiceItemHistory } from '../ServiceItemHistory'
import { ServiceStoreItems } from '../ServiceStoreItems'

type ValueOfKey<T, K extends keyof T> = T[K]
type Type = Partial<ItemType>

export const onEditItemField = async <K extends keyof Type>({
  storeId,
  itemId,
  field,
  value
}: {
  storeId: string
  itemId: string
  field: K
  value: ValueOfKey<ItemType, K>
}) => {
  //* <------------------ UPDATE ITEM FIELD
  return ServiceStoreItems.updateField({
    field,
    value,
    storeId,
    itemId
  })
}

//*************  SECONDARY FUNCTIONS  **********************/

export const onCreateItem = async ({
  storeId,
  item
}: {
  storeId: string
  item: Type
}) => {
  await ServiceStoreItems.add({
    item,
    storeId
  })
  // await onRegistryEntry({
  //   storeId,
  //   itemId: item.id || '',
  //   type: 'created'
  // })

  return
}

export const onDeleteItem = async ({
  storeId,
  itemId
}: {
  storeId: string
  itemId: string
}) => {
  return await ServiceStoreItems.delete({
    storeId,
    itemId
  })
}

export const onUpdateItem = async ({
  storeId,
  itemId,
  values
}: {
  storeId: string
  itemId: string
  values: Type
}) => {}
export const onChangeItemSection = async ({
  storeId,
  itemId,
  sectionId
}: {
  storeId: string
  itemId: string
  sectionId: string
}) => {
  return await ServiceStoreItems.updateField({
    storeId,
    itemId,
    field: 'assignedSection',
    value: sectionId
  })
}

export const onPickUpItem = async ({ storeId, itemId, orderId }) => {
  onRegistryEntry({
    storeId,
    itemId,
    type: 'pickup',
    orderId
  })
  return await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO PICKED UP
    storeId,
    itemId,
    field: 'status',
    value: 'pickedUp'
  })
}
export const onRentItem = async ({ storeId, itemId, orderId }) => {
  onRegistryEntry({
    storeId,
    itemId,
    type: 'delivery',
    orderId
  })
  return await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO DELIVERED
    storeId,
    itemId,
    field: 'status',
    value: 'rented'
  })
}

export const onRegistryEntry = async ({
  storeId,
  itemId,
  type,
  orderId
}: {
  storeId: string
  itemId: string
  type: ItemHistoryType['type']
  orderId: string
}) => {
  return await ServiceItemHistory.addEntry({
    storeId,
    itemId,
    entry: {
      type,
      orderId
    }
  })
}

// export const onPickUpItem = async ({ storeId, itemId }) => {
//   await onEditItemField({
//     //* <------------------ UPDATE ITEM STATUS TO PICKED UP
//     storeId,
//     itemId,
//     field: 'status',
//     value: 'pickedUp'
//   })
//   //TODO: Add log to item history
//   //* <------------------ ADD LOG TO ITEM HISTORY
// }

// export const onRentItem = async ({ storeId, itemId }) => {
//   await onEditItemField({
//     //* <------------------ UPDATE ITEM STATUS TO DELIVERED
//     storeId,
//     itemId,
//     field: 'status',
//     value: 'rented'
//   })
//   //TODO: Add log to item history
//   //* <------------------ ADD LOG TO ITEM HISTORY
// }

// export const onRepairingItem = async ({ storeId, itemId }) => {
//   await onEditItemField({
//     //* <------------------ UPDATE ITEM STATUS TO REPAIRING
//     storeId,
//     itemId,
//     field: 'status',
//     value: 'maintenance'
//   })
//   //TODO: Add log to item history
//   //* <------------------ ADD LOG TO ITEM HISTORY
// }

// export const onCreateItem = async ({
//   storeId,
//   item,
//   itemId,
//   userId
// }: {
//   storeId: string
//   item: Partial<ItemType>
//   itemId: string
//   userId: string
// }) => {
//   const newItem: Partial<ItemType> = {
//     id: itemId,
//     brand: item.brand || '',
//     serial: item.serial || '',
//     category: item.category || '',
//     createdAt: new Date(),
//     createdBy: userId || '',
//     status: 'available',
//     number: item.number || '',
//     assignedSection: item.assignedSection || ''
//   }
//   return await ServiceStores.update(storeId, {
//     //* <------------------ CREATE ITEM

//     [`items.${itemId}`]: newItem
//   })
// }

// export const onDeleteItem = async ({ storeId, itemId }) => {
//   return await ServiceStores.update(storeId, {
//     //* <------------------ DELETE ITEM
//     [`items.${itemId}`]: deleteField()
//   })
// }

// export const onOverrideItem = async ({
//   storeId,
//   itemId,
//   values
// }: {
//   storeId: string
//   itemId: string
//   values: Partial<ItemType>
// }) => {
//   return await ServiceStores.update(storeId, {
//     //* <------------------ OVERRIDE ITEM
//     [`items.${itemId}`]: values
//   })
// }
