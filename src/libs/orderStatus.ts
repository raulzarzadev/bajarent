import OrderType, { OrderStatus, order_status } from '../types/OrderType'

const orderStatus = (order: Partial<OrderType>): OrderStatus => {
  let status: OrderStatus = order?.status || order_status.PENDING

  // const notSolvedReports = order?.comments?.find(
  //   (comment) => comment?.type === 'report' && !comment?.solved
  // )
  // if (notSolvedReports) {
  //   status = 'REPORTED'
  // }

  return status
}

export default orderStatus
