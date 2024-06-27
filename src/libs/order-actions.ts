import { handleSetStatuses } from '../components/OrderActions/libs/update_statuses'
import { ExtendReason, ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import { CommentType } from '../types/CommentType'
import OrderType, { order_status } from '../types/OrderType'
import PaymentType from '../types/PaymentType'
import { TimePriceType } from '../types/PriceType'
import StoreType from '../types/StoreType'

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
  items
}: {
  orderId: string
  userId: string
  expireAt: Date
  items: OrderType['items']
}) => {
  return await ServiceOrders.update(orderId, {
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
