import { isBefore, isToday, isTomorrow } from 'date-fns'
import OrderType, {
  OrderStatus,
  order_status,
  orders_should_expire
} from '../types/OrderType'
import asDate from './utils-date'

const orderStatus = (order: Partial<OrderType>): OrderStatus => {
  //if (order.hasNotSolvedReports) return order_status.REPORTED //! this breaks some things
  let status: OrderStatus = order?.status || order_status.PENDING

  if (status === order_status.PICKUP) return status
  if (status === order_status.PENDING) return status
  if (status === order_status.RENEWED) return status
  if (status === order_status.REPAIRING) return status
  if (status === order_status.REPAIRED) return status
  if (status === order_status.DELIVERED) {
    if (!order.expireAt) {
      // console.error('first you need to set expireAt')
      // console.error('check if item is missing')
      return status
    }
    // //* validate if this kind of order should be expired
    if (orders_should_expire.includes(order.type)) {
      const expireAt = asDate(order.expireAt)

      /* ********************************************
       * if the order timing is more than 24 hours should't validate if expires today or tomorrow
       * in other case,
       *******************************************rz */

      if (isToday(expireAt) || isBefore(expireAt, new Date())) {
        status = order_status.EXPIRED
        return status
      }

      // if (expireAt && isTomorrow(expireAt)) {
      //   status = order_status.EXPIRED_TOMORROW
      //   return status
      // }
      // if (expireAt && isBefore(expireAt, new Date())) {
      //   status = order_status.EXPIRED
      //   return status
      // }
    }
  }

  return status
}

export default orderStatus
