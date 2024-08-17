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

// Define the shape of the order object
type Order = OrderType

// Define the shape of the context
interface OrderContextProps {
  order?: Order
  setOrder?: (order: Order) => void
}

// Create the initial context
const OrderContext = createContext<OrderContextProps>({})

// Create the OrderContext provider component
const OrderProvider = ({ children }: { children: ReactNode }) => {
  const route = useRoute()
  const [order, setOrder] = useState<Order>()

  //@ts-ignore
  const orderId = route?.params?.orderId

  useEffect(() => {
    if (orderId) {
      listenFullOrderData(orderId, (order) => {
        setOrder(order)
      })
    }
  }, [orderId])
  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderDetails = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
