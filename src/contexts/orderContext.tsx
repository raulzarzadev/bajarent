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
const OrderProvider = ({ children }: { children: ReactNode }) => {
  const route = useRoute()
  //@ts-ignore
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState<Order>()

  const [payments, setPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (orderId) {
      ServicePayments.listenByOrder(orderId, setPayments)
    }
    return () => {}
  }, [orderId])

  useEffect(() => {
    if (orderId) {
      listenFullOrderData(orderId, (order) => {
        setOrder(order)
      })
    }
  }, [orderId])
  return (
    <OrderContext.Provider value={{ order, setOrder, payments }}>
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderDetails = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
