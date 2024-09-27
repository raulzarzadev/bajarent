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

// Define the shape of the order object
type Order = OrderType

// Define the shape of the context
interface OrderContextProps {
  order?: Order
  setOrder?: (order: Order) => void
  payments?: PaymentType[]
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
  const route = useRoute()
  //@ts-ignore
  const _orderId = orderId || route?.params?.orderId
  const [order, setOrder] = useState<Order>()

  const [payments, setPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (_orderId) {
      ServicePayments.listenByOrder(_orderId, setPayments)
    }
    return () => {}
  }, [_orderId])

  useEffect(() => {
    if (_orderId) {
      listenFullOrderData(_orderId, (order) => {
        setOrder(order)
      })
    }
  }, [_orderId])

  return (
    <OrderContext.Provider value={{ order, setOrder, payments }}>
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderDetails = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
