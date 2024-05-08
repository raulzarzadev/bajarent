import { ServiceOrders } from '../../firebase/ServiceOrders'
import {
  onAuthorize,
  onCancel,
  onComment,
  onDelivery,
  onPickup,
  onRenew,
  onRepairFinish,
  onRepairStart
} from '../../libs/order-actions'
import OrderType from '../../types/OrderType'
import { CommentType } from '../ListComments'

const onOrderComment = async ({
  content,
  type = 'comment',
  orderId,
  storeId
}: {
  content: string
  type?: CommentType['type']
  orderId: string
  storeId: string
}) => {
  return await onComment({ orderId, content, storeId, type })
}
export const handleDelivery = async ({
  values,
  orderId,
  userId,
  storeId
}: {
  values: Pick<OrderType, 'location' | 'itemSerial' | 'items'>
  orderId: string
  userId: string
  storeId: string
}) => {
  const location = values?.location || ''
  const itemSerial = values?.itemSerial || ''
  const items = values?.items || []
  try {
    await ServiceOrders.update(orderId, { location, itemSerial, items })

    await onDelivery({ orderId, userId })
    await onOrderComment({ content: 'Entregada', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}

export const handlePickup = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onPickup({ orderId, userId })
    await onOrderComment({ content: 'Recogida', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}

export const handleRenew = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onRenew({ orderId, userId })
    await onOrderComment({ content: 'Renovada', orderId, storeId })
  } catch (error) {
    console.log(error)
  }
}

export const handleCancel = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onCancel({ orderId, userId })
    await onOrderComment({ content: 'Cancelada', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}

export const handleRepairStart = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onRepairStart({ orderId, userId })
    await onOrderComment({ content: 'Reparación comenzada', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}

export const handleRepairFinish = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onRepairFinish({ orderId, userId })
    await onOrderComment({ content: 'Reparación terminada', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}

export const handleAuthorize = async ({
  orderId,
  userId,
  storeId
}: {
  orderId: string
  userId: string
  storeId: string
}) => {
  try {
    await onAuthorize({ orderId, userId })
    await onOrderComment({ content: 'Autorizada', storeId, orderId })
  } catch (error) {
    console.log(error)
  }
}
