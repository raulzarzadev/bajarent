import { isBefore } from 'date-fns'
import OrderType, {
  OrderStatus,
  order_status,
  order_type
} from '../types/OrderType'
import asDate from './utils-date'

const orderStatus = (order: Partial<OrderType>): OrderStatus => {
  if (order.status === order_status.PICKUP) return order.status

  if (
    ![
      order_type.RENT,
      order_type.DELIVERY_RENT,
      order_type.STORE_RENT
    ].includes(order.type)
  )
    return order.status
  let status: OrderStatus = order?.status || order_status.PENDING
  const expireAt = asDate(order.expireAt)

  if (
    isBefore(asDate(expireAt), new Date()) &&
    !(status === order_status.RENEWED)
  ) {
    status = order_status.EXPIRED
  }

  return status
}

export default orderStatus
