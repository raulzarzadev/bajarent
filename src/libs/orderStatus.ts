import { isBefore } from 'date-fns'
import OrderType, { OrderStatus, order_status } from '../types/OrderType'
import asDate from './utils-date'
import expireDate from './expireDate'

const orderStatus = (order: Partial<OrderType>): OrderStatus => {
  let status: OrderStatus = order?.status || order_status.PENDING
  const expireAt = expireDate(
    order?.item?.priceSelected?.time,
    order?.deliveredAt
  )
  if (
    isBefore(asDate(expireAt), new Date()) &&
    !(status === order_status.RENEWED)
  ) {
    status = order_status.EXPIRED
  }

  return status
}

export default orderStatus
