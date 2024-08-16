import { ItemSelected } from '../../components/FormSelectItem'
import { onComment, onDelivery } from '../../libs/order-actions'
import ItemType from '../../types/ItemType'
import { ItemHistoryType, ServiceItemHistory } from '../ServiceItemHistory'
import { ServiceOrders } from '../ServiceOrders'
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
  const res = await ServiceStoreItems.add({
    item,
    storeId
  })
  const newItemId = res?.res?.id
  await onRegistryEntry({
    storeId,
    itemId: newItemId || '',
    type: 'created'
  })

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
}) => {
  return await ServiceStoreItems.update({
    storeId,
    itemId,
    itemData: values
  })
}

export const onChangeItemSection = async ({
  storeId,
  itemId,
  sectionId,
  sectionName
}: {
  storeId: string
  itemId: string
  sectionId: string
  sectionName?: string
}) => {
  onRegistryEntry({
    itemId,
    storeId,
    type: 'assignment',
    content: `Se asigno al area ${sectionName || sectionId}`
  })
  return await ServiceStoreItems.updateField({
    storeId,
    itemId,
    field: 'assignedSection',
    value: sectionId
  })
}

export const onPickUpItem = async ({
  storeId,
  itemId,
  orderId,
  assignToSection = null
}: {
  storeId: string
  itemId: string
  orderId: string
  assignToSection?: string
}) => {
  onEditItemField({
    //* <------------------ WHEN PICK UP ITEM REASSIGN TO SECTION
    storeId,
    itemId,
    field: 'assignedSection',
    value: assignToSection
  })
  const pickedUpRes = await onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO PICKED UP
    storeId,
    itemId,
    field: 'status',
    value: 'pickedUp'
  })
    //.then((res) => console.log({ res }))
    .catch((err) => console.error({ err }))
  //* <------------------ ADD REGISTRY ENTRY
  const registryRes = await onRegistryEntry({
    storeId,
    itemId,
    type: 'pickup',
    orderId
  })
    .then((res) => console.log({ res }))
    .catch((err) => console.error({ err }))
  return pickedUpRes
}

export const onRentItem = async ({ storeId, itemId, orderId }) => {
  onEditItemField({
    //* <------------------ UPDATE ITEM STATUS TO DELIVERED
    storeId,
    itemId,
    field: 'status',
    value: 'rented'
  })
    .then((res) => console.log({ res }))
    .catch((err) => console.error({ err }))
  //* <------------------ UPDATE ITEM STATUS TO DELIVERED
  // onRegistryEntry({
  //   storeId,
  //   itemId,
  //   type: 'delivery',
  //   orderId
  // })
  //   .then((res) => console.log({ res }))
  //   .catch((err) => console.error({ err }))
}

export const onReactiveItem = async ({ storeId, itemId }) => {
  ServiceStoreItems.update({
    storeId,
    itemId,
    itemData: {
      status: 'pickedUp',
      retiredAt: null,
      retiredBy: null
    }
  })
  await ServiceStoreItems.addEntry({
    storeId,
    itemId,
    entry: {
      type: 'reactivate',
      content: 'Reactivada',
      itemId
    }
  })

  return
}
export const onRetireItem = async ({ storeId, itemId, userId }) => {
  ServiceStoreItems.update({
    storeId,
    itemId,
    itemData: {
      status: 'retired',
      retiredAt: new Date(),
      retiredBy: userId
    }
  })
  await ServiceStoreItems.addEntry({
    storeId,
    itemId,
    entry: {
      type: 'retire',
      content: 'Dada de baja',
      itemId
    }
  })

  return
}
export const onRegistryEntry = async ({
  storeId,
  itemId,
  type,
  orderId = '',
  content = ''
}: {
  storeId: string
  itemId: string
  type: ItemHistoryType['type']
  orderId?: string
  content?: string
}) => {
  return await ServiceItemHistory.addEntry({
    storeId,
    itemId,
    entry: {
      type,
      orderId,
      content
    }
  })
}

export const onChangeOrderItem = async ({
  itemId,
  orderId,
  storeId,
  newItem
}: {
  itemId: string
  orderId: string
  storeId: string
  newItem: ItemSelected
}) => {
  const newItemId = newItem?.id
  try {
    if (!newItemId || itemId === newItemId)
      return console.log('no new item or is the same ')
    //* get numbers
    const oldItem = await ServiceStoreItems.get({ storeId, itemId }).then(
      (res) => res
    )
    const oldItemNumber = oldItem?.number

    const newItemNumber = newItem?.number
    const newItemCategoryName = newItem?.categoryName
    //* 1 update item id in order
    await ServiceOrders.updateItemId({
      orderId,
      itemId,
      newItemId,
      newItemCategoryName
    })

    //* 2 update old item status to picked up
    //******* if oldItem not exist don picked up. in case of you want to assign a item to order that has not real item
    if (oldItem) {
      await onPickUpItem({ storeId, itemId, orderId })
    }
    //* 3 update new item  status to rented
    await onRentItem({ storeId, itemId: newItemId, orderId })
    //* 4 add registry entry to old item
    await onRegistryEntry({
      type: 'exchange',
      itemId,
      orderId,
      storeId,
      content: `Se cambio por el artículo ${newItemNumber || 'SA'}`
    }).catch((e) => console.log('Error on registry entry', { e }))
    //* 5 add registry entry to new item
    await onRegistryEntry({
      type: 'exchange',
      itemId: newItemId,
      orderId,
      storeId,
      content: `Se cambio por el artículo ${oldItemNumber || 'SA'}`
    }).catch((e) => console.log('Error on registry entry', { e }))
    //* 6 add registry entry to order

    onComment({
      type: 'comment',
      storeId,
      orderId,
      content: `Se cambio el artículo ${
        oldItemNumber || 'SA'
      } por el artículo ${newItemNumber}`
    })
  } catch (e) {
    console.log('Error on changing item', { e })
  }
}

export const onAssignItem = async ({
  newItemId,
  orderId,
  oldItemId,
  storeId,
  newItemNumber
}: {
  newItemId: string
  orderId: string
  oldItemId: string
  storeId: string
  newItemNumber?: string
}) => {
  try {
    //* 1. update item status to rented
    onRentItem({ storeId, itemId: newItemId, orderId })

    //* 2. update order item id
    ServiceOrders.updateOrderItemId({
      oldItemId: oldItemId,
      newItemId: newItemId,
      orderId
    })
    //* 3. add registry entry to new item
    onRegistryEntry({
      storeId,
      itemId: newItemId,
      type: 'delivery',
      orderId
    })
    //* 4. add registry entry to order
    // onComment({
    //   storeId,
    //   orderId,
    //   type: 'comment',
    //   content: `Se asigno el artículo ${newItemNumber || newItemId}`
    // }).catch(console.error)
  } catch (error) {
    console.error({ error })
  }
}
