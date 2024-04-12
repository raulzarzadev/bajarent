import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_status } from '../types/OrderType'

export const onComment = async ({ orderId, storeId, content, type }) => {
  return await ServiceOrders.addComment({
    storeId,
    orderId,
    type,
    content
  })
    .then(console.log)
    .catch(console.error)
}

export const onAuthorize = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.AUTHORIZED,
    authorizedAt: new Date(),
    authorizedBy: userId
  })
    .then(console.log)
    .catch(console.error)
}

export const onDelivery = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredBy: userId
  })
    .then(console.log)
    .catch(console.error)
}

export const onPickup = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PICKUP,
    pickedUpAt: new Date(),
    pickedUpBy: userId
  })
    .then(console.log)
    .catch(console.error)
}

export const onRepairStart = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRING,
    repairingAt: new Date(),
    repairingBy: userId
  })
    .then(console.log)
    .catch(console.error)
}

export const onRepairFinish = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRED,
    repairedAt: new Date(),
    repairedBy: userId
  })
    .then(console.log)
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
    .then(console.log)
    .catch(console.error)
}
