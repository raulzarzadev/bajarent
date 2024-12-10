import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import OrderType from '../types/OrderType'
import { listenFullOrderData } from './libs/getFullOrderData'
import { useRoute } from '@react-navigation/native'
import { ServicePayments } from '../firebase/ServicePayments'
import PaymentType from '../types/PaymentType'
import { ServiceComments } from '../firebase/ServiceComments'
import { CommentType } from '../types/CommentType'
import { useOrdersCtx } from './ordersContext'

// Define the shape of the order object
type Order = OrderType

// Define the shape of the context
interface OrderContextProps {
  order?: Order
  setOrder?: (order: Order) => void
  payments?: PaymentType[]
  setPaymentsCount?: (count: number) => void
  setCommentsCount?: (count: number) => void
  paymentsCount?: number
  commentsCount?: number
}

// Create the initial context
const OrderContext = createContext<OrderContextProps>({})

// Create the OrderContext provider component
const OrderProvider = ({
  children,
  orderId
}: {
  children: ReactNode
  orderId?: OrderType['id']
}) => {
  const { consolidatedOrders } = useOrdersCtx()
  const route = useRoute()
  //@ts-ignore
  const _orderId = orderId || route?.params?.orderId
  const [order, setOrder] = useState<Order>()
  const [paymentsCount, setPaymentsCount] = useState(2)
  const [payments, setPayments] = useState<PaymentType[]>([])

  const [orderComments, setOrderComments] = useState<CommentType[]>([])
  const [commentsCount, setCommentsCount] = useState(4)

  useEffect(() => {
    if (_orderId) {
      ServicePayments.listenByOrder(_orderId, setPayments, {
        count: paymentsCount
      })
    }
    return () => {}
  }, [_orderId, paymentsCount])

  useEffect(() => {
    if (_orderId) {
      listenFullOrderData(_orderId, (order) => {
        console.log({ order })
        if (order) return setOrder({ ...order, comments: orderComments })
        const consolidatedOrder = consolidatedOrders?.orders[_orderId]
        console.log({ consolidatedOrder })
        // @ts-ignore
        return setOrder({
          ...consolidatedOrder,
          isConsolidated: true,
          comments: orderComments
        })
      })
    }
  }, [_orderId, consolidatedOrders])

  useEffect(() => {
    if (_orderId) {
      ServiceComments.listenLastByOrder({
        count: commentsCount,
        orderId: _orderId,
        cb: (comments) => {
          setOrderComments(comments)
        }
      })
    }
    return () => {}
  }, [_orderId, commentsCount])

  return (
    <OrderContext.Provider
      value={{
        //@ts-ignore
        order,
        setOrder,
        payments,
        setPaymentsCount,
        setCommentsCount,
        paymentsCount,
        commentsCount
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderDetails = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
