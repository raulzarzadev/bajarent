import { ServiceComments } from '../../firebase/ServiceComments'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { ServicePayments } from '../../firebase/ServicePayments'
import { formatOrder } from '../../libs/orders'
import OrderType from '../../types/OrderType'
import { CommentType } from '../../types/CommentType'

export const getFullOrderData = async (orderId: string): Promise<OrderType> => {
  const order = await ServiceOrders.get(orderId)
  const payments = await ServicePayments.getByOrder(orderId)
  const comments = await ServiceComments.getByOrder(orderId)
  const formattedOrder = formatOrder({ comments, order })

  return { ...formattedOrder, payments, comments }
}

export const listenFullOrderData = (orderId: string, cb: CallableFunction) => {
  let currentOrder: OrderType | undefined | null = undefined
  let currentReports: CommentType[] = []
  let orderLoaded = false

  const update = () => {
    if (!orderLoaded) return

    if (!currentOrder) {
      cb(undefined)
      return
    }

    const formattedOrder = formatOrder({
      comments: currentReports,
      order: currentOrder
    })
    cb({ ...formattedOrder, comments: currentReports })
  }

  const unsubOrder = ServiceOrders.listen(orderId, (order) => {
    currentOrder = order
    orderLoaded = true
    update()
  })

  const unsubComments = ServiceComments.listenOrderReports(
    orderId,
    (reports) => {
      currentReports = reports || []
      update()
    }
  )

  return () => {
    unsubOrder && unsubOrder()
    unsubComments && unsubComments()
  }
}
