import OrderType, { OrderStatus } from '../types/OrderType'

const orderStatus = (order: OrderType): OrderStatus => {
  let status: OrderStatus = order?.status || 'PENDING'

  // const notSolvedReports = order?.comments?.find(
  //   (comment) => comment?.type === 'report' && !comment?.solved
  // )
  // if (notSolvedReports) {
  //   status = 'REPORTED'
  // }

  return status
}

export default orderStatus
