import { handleSetStatuses } from '../components/OrderActions/libs/update_statuses'
import { Order } from '../DATA'
import {
  onPickUpItem,
  onRegistryEntry,
  onRentItem
} from '../firebase/actions/item-actions'
import { ExtendReason, ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import { CommentType } from '../types/CommentType'
import OrderType, { order_status, order_type } from '../types/OrderType'
import PaymentType from '../types/PaymentType'
import { TimePriceType } from '../types/PriceType'
import StoreType from '../types/StoreType'
import { orderExpireAt } from './orders'

export const onComment = async ({
  orderId,
  storeId,
  content,
  type
}: {
  orderId: string
  storeId: string
  content: string
  type: CommentType['type']
}) => {
  return await ServiceOrders.addComment({
    storeId,
    orderId,
    type,
    content
  })
    .then(() => {
      console.log('comment')
    })
    .catch(console.error)
}

export const onAuthorize = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.AUTHORIZED,
    authorizedAt: new Date(),
    authorizedBy: userId
  })
    .then((res) => {
      console.log('authorize')
    })
    .catch(console.error)
}

export const onDelivery = async ({
  orderId,
  userId,
  expireAt,
  items,
  order
}: {
  orderId: string
  userId: string
  expireAt: Date
  items: OrderType['items']
  order?: Partial<OrderType>
}) => {
  return await ServiceOrders.update(orderId, {
    ...order,
    expireAt,
    status: order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredBy: userId,
    isDelivered: true,
    items
  })
    .then(() => {
      console.log('delivery')
    })
    .catch(console.error)
}

export const onPickup = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PICKED_UP,
    pickedUpAt: new Date(),
    pickedUpBy: userId,
    isDelivered: false
  })
    .then(() => {
      console.log('pickup')
    })
    .catch(console.error)
}

export const onRepairStart = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRING,
    repairingAt: new Date(),
    repairingBy: userId,
    isRepairing: true
  })
    .then(() => {
      console.log('repairing')
    })
    .catch(console.error)
}

export const onRepairFinish = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRED,
    repairedAt: new Date(),
    repairedBy: userId,
    isRepairing: false
  })
    .then(() => {
      console.log('repaired')
    })
    .catch(console.error)
}
export const onRepairDelivery = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredBy: userId,
    isDelivered: true
  })
    .then(() => {
      console.log('delivery')
    })
    .catch(console.error)
}

export const onRenew = async ({ orderId, renewedTo = '', userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.RENEWED,
    renewedAt: new Date(),
    renewedBy: userId,
    renewedTo,
    isRenewed: true
  })
    .then(console.log)
    .catch(console.error)
}
export const onCancel = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.CANCELLED,
    cancelledAt: new Date(),
    cancelledBy: userId,
    isCancelled: true
  })
    .then(() => {
      console.log('cancel')
    })
    .catch(console.error)
}

export const onDelete = async ({ orderId }) => {
  //? should be a soft delete isDeleted: true
  return await ServiceOrders.delete(orderId)
    .then(() => {
      console.log('delete')
    })
    .catch(console.error)
}

export const onPending = async ({ orderId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PENDING
  })
    .then(() => {
      console.log('pending')
    })
    .catch(console.error)
}

export const onExtend = async (
  orderId: string,
  { time, reason }: { time: TimePriceType; reason: string }
) => {
  return await ServiceOrders.update(orderId, {
    extendTime: time,
    extendReason: reason,
    isExtended: true
  })
    .then(() => {})
    .catch(console.error)
}

export const onExtend_V2 = async ({
  orderId,
  time,
  reason,
  startAt,
  items
}: {
  orderId: string
  time: TimePriceType
  reason: ExtendReason
  startAt: Date
  items: OrderType['items']
}) => {
  //********* Add the original order to extends list if it does't have  extensions
  const order = await ServiceOrders.get(orderId)
  if (!order?.extensions) {
    await ServiceOrders.onExtend({
      items: order.items,
      orderId: order.id,
      startAt: order.deliveredAt,
      time: order.items[0].priceSelected.time,
      reason: 'original'
    })
  }

  return await ServiceOrders.onExtend({
    orderId,
    time,
    reason,
    startAt,
    items
  })
}

export const onPay = async ({
  orderId,
  payment,
  storeId
}: {
  orderId: OrderType['id']
  storeId: StoreType['id']
  payment: PaymentType
}) => {
  return await ServicePayments.orderPayment({ orderId, storeId, ...payment })
}

export const onSetStatuses = async ({ orderId }) => {
  const order = await ServiceOrders.get(orderId)
  const { order: newOrder } = handleSetStatuses({ order })
  return await ServiceOrders.update(orderId, { ...newOrder, statuses: true })
}

export const onRentFinish = async ({
  order,
  userId
}: {
  order: Partial<OrderType>
  userId: string
}) => {
  const items = order?.items || []
  const storeId = order.storeId
  const orderId = order?.id

  if (order.type != order_type.RENT)
    return console.error('Order is not a rent order')

  const promises = items?.map(async (item) => {
    return onPickUpItem({
      storeId,
      itemId: item.id,
      orderId: order.id
    })
      .then(async (res) => {
        // console.log({ res }, 'item picked up', item?.id, item?.number)
      })
      .catch(console.error)
  })

  await Promise.all(promises)
    .then((res) => {
      //  console.log({ res })
    })
    .catch(console.error)

  //* pickup order
  await onPickup({ orderId, userId })

  //* create movement
  await onComment({
    orderId,
    storeId,
    content: 'Recogida',
    type: 'comment'
  })

  //*pickup items
}
export const onRentStart = async ({
  order,
  userId,
  deliveredAt = new Date()
}: {
  order: Partial<OrderType>
  userId: string
  deliveredAt?: Date
}) => {
  const items = order?.items || []
  const storeId = order.storeId
  const orderId = order?.id

  if (order.type != order_type.RENT)
    return console.error('Order is not a rent order')

  const expireAt = orderExpireAt({
    order: { ...order, deliveredAt: deliveredAt }
  })
  //* delivery order
  onDelivery({
    expireAt,
    orderId,
    userId,
    items,
    order
  })
    .then((res) => console.log({ res }))
    .catch(console.error)

  //* create movement
  await onComment({
    orderId,
    storeId,
    content: 'Entregada',
    type: 'comment'
  })

  //* delivery items
  const rentOrderPromises = items.map((item) => {
    return onRentItem({
      itemId: item.id,
      storeId: storeId,
      orderId
    })
  })
  const registryItemsEntriesPromises = items.map((item) => {
    return onRegistryEntry({
      storeId,
      itemId: item.id,
      type: 'delivery',
      orderId
    })
      .then((res) => console.log({ res }))
      .catch((err) => console.error({ err }))
  })

  await Promise.all(rentOrderPromises)
    .then((res) => console.log({ res }))
    .catch(console.error)

  await Promise.all(registryItemsEntriesPromises)
    .then((res) => console.log({ res }))
    .catch(console.error)
}
