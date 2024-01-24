import OrderType, { OrderStatus } from '../types/OrderType'

const orderStatus = (order: OrderType): OrderStatus => {
  let status: OrderStatus = 'PENDING'

  status = order?.status || 'PENDING'
  const report = order?.comments?.find((comment) => comment?.type === 'report')
  if (report && !report?.solved) {
    status = 'REPORTED'
  }

  return status
}

export default orderStatus
