import React, { ReactNode, createContext, useContext, useState } from 'react'
import OrderType from '../types/OrderType'

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
const OrderProvider: React.FC = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>()

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderCtx = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
