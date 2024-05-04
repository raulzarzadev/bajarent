import { ServiceComments } from '../../firebase/ServiceComments'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { ServicePayments } from '../../firebase/ServicePayments'
import { formatOrder, formatOrders } from '../../libs/orders'
import OrderType from '../../types/OrderType'

export const getFullOrderData = async (orderId: string): Promise<OrderType> => {
  const order = await ServiceOrders.get(orderId)
  const payments = await ServicePayments.getByOrder(orderId)
  const comments = await ServiceComments.getByOrder(orderId)
  const formattedOrder = formatOrder({ comments, order })
  return { ...formattedOrder, payments, comments }
}

export const listenFullOrderData = async (
  orderId: string,
  cb: CallableFunction
) => {
  const payments = await ServicePayments.getByOrder(orderId)
  const comments = await ServiceComments.getByOrder(orderId)
  ServiceOrders.listen(orderId, (order) => {
    const formattedOrder = formatOrder({ comments, order })
    cb({ ...formattedOrder, payments, comments })
  })
}
