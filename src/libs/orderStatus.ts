import OrderType, { OrderStatus } from '../types/OrderType'

const orderStatus = (order: OrderType): OrderStatus => {
  let status: OrderStatus = 'PENDING'

  status = order?.status || 'PENDING'

  if (order?.comments?.find((comment) => comment?.type === 'report')) {
    status = 'REPORTED'
  }

  return status
}

export default orderStatus
