import { ServiceOrders } from '../firebase/ServiceOrders'
import { CommentType } from '../types/CommentType'
import { order_status } from '../types/OrderType'
import { TimePriceType } from '../types/PriceType'

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

export const onDelivery = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredBy: userId
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
    pickedUpBy: userId
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
    repairingBy: userId
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
    repairedBy: userId
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
    renewedTo
  })
    .then(console.log)
    .catch(console.error)
}
export const onCancel = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.CANCELLED,
    cancelledAt: new Date(),
    cancelledBy: userId
  })
    .then(() => {
      console.log('cancel')
    })
    .catch(console.error)
}

export const onDelete = async ({ orderId }) => {
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
    extendTime: time || '',
    extendReason: reason || ''
  })
    .then(() => {})
    .catch(console.error)
}
