import { deleteField } from 'firebase/firestore'
import { ServiceStores } from '../firebase/ServiceStore'
import ItemType from '../types/ItemType'
// * GENERIC TYPE
type ValueOfKey<T, K extends keyof T> = T[K]

//************* MAIN FUNCTION  **********************/
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onEditItemField = async <K extends keyof ItemType>({
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
  ServiceStores.update(storeId, {
    [`items.${itemId}.${field}`]: value
  })
}

//*************  SECONDARY FUNCTIONS  **********************/
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onPickUpItem = async ({ storeId, itemId }) => {
  await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO PICKED UP
    storeId,
    itemId,
    field: 'status',
    value: 'pickedUp'
  })
  //TODO: Add log to item history
  //* <------------------ ADD LOG TO ITEM HISTORY
}
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onRentItem = async ({ storeId, itemId }) => {
  await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO DELIVERED
    storeId,
    itemId,
    field: 'status',
    value: 'rented'
  })
  //TODO: Add log to item history
  //* <------------------ ADD LOG TO ITEM HISTORY
}
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onRepairingItem = async ({ storeId, itemId }) => {
  await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO REPAIRING
    storeId,
    itemId,
    field: 'status',
    value: 'maintenance'
  })
  //TODO: Add log to item history
  //* <------------------ ADD LOG TO ITEM HISTORY
}
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onCreateItem = async ({
  storeId,
  item,
  itemId,
  userId
}: {
  storeId: string
  item: Partial<ItemType>
  itemId: string
  userId: string
}) => {
  const newItem: Partial<ItemType> = {
    id: itemId,
    brand: item.brand || '',
    serial: item.serial || '',
    category: item.category || '',
    createdAt: new Date(),
    createdBy: userId || '',
    status: 'available',
    number: item.number || '',
    assignedSection: item.assignedSection || ''
  }
  return await ServiceStores.update(storeId, {
    //* <------------------ CREATE ITEM

    [`items.${itemId}`]: newItem
  })
}
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onDeleteItem = async ({ storeId, itemId }) => {
  return await ServiceStores.update(storeId, {
    //* <------------------ DELETE ITEM
    [`items.${itemId}`]: deleteField()
  })
}
/**
 * @deprecated use actions/item-actions.ts instead
 */
export const onOverrideItem = async ({
  storeId,
  itemId,
  values
}: {
  storeId: string
  itemId: string
  values: Partial<ItemType>
}) => {
  return await ServiceStores.update(storeId, {
    //* <------------------ OVERRIDE ITEM
    [`items.${itemId}`]: values
  })
}
