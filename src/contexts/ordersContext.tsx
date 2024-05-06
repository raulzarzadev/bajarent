import { createContext, useContext, useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'

export type FetchTypeOrders =
  | 'all'
  | 'solved'
  | 'unsolved'
  | 'mine'
  | 'mineSolved'
  | 'mineUnsolved'
export type OrdersContextType = {
  orders: OrderType[]
  ordersFetch: FetchTypeOrders
}

export const OrdersContext = createContext({})

export const OrdersContextProvider = ({ children }) => {
  const {
    employee,
    permissions: { orders: ordersPermissions, isOwner, isAdmin }
  } = useEmployee()

  const [orders, setOrders] = useState<OrderType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  console.log({ fetchTypeOrders })
  useEffect(() => {
    if (ordersPermissions.canViewMy) {
      setFetchTypeOrders('mine')
      ServiceOrders.getBySections(employee.sectionsAssigned).then((orders) =>
        setOrders(orders)
      )
      console.log({ employee })
    }
  }, [fetchTypeOrders, employee])

  console.log({ orders })

  return <OrdersContext.Provider value={{}}>{children}</OrdersContext.Provider>
}

export const useOrdersCtx = () => useContext(OrdersContext)
