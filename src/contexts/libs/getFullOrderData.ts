import { ServiceComments } from '../../firebase/ServiceComments'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { ServicePayments } from '../../firebase/ServicePayments'
import { formatOrder } from '../../libs/orders'
import asDate, { dateFormat } from '../../libs/utils-date'
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
  ServiceOrders.listen(orderId, async (order) => {
    console.log({ orderExpireAt: dateFormat(asDate(order.expireAt)) })

    const payments = await ServicePayments.getByOrder(orderId)
    await ServiceComments.listenOrderReports(orderId, (reports) => {
      const formattedOrder = formatOrder({ comments: reports, order })
      console.log({ orderExpire2: dateFormat(asDate(formattedOrder.expireAt)) })
      cb({ ...formattedOrder, payments, comments: reports })
    })
  })
}
