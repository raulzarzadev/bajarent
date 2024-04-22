import { createContext, useContext, useEffect, useState } from 'react'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'
import OrderType from '../types/OrderType'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  orders: OrderType[]
  permissions: {
    isAdmin: boolean
    isOwner: boolean
    orders: StaffType['permissions']['order']
    store: StaffType['permissions']['store']
  }
}

const EmployeeContext = createContext<EmployeeContextType>({
  employee: null,
  orders: [],
  permissions: { isAdmin: false, isOwner: false, orders: {}, store: {} }
})

export const EmployeeContextProvider = ({ children }) => {
  const { user, store } = useAuth()
  const employee = store?.staff?.find((s) => s?.userId === user?.id)
  const isOwner = user?.id && store?.createdBy === user?.id
  const isAdmin = employee?.permissions?.isAdmin
  const [myOrders, setMyOrders] = useState<OrderType[]>([])

  return (
    <EmployeeContext.Provider
      value={{
        orders: myOrders,
        employee,
        permissions: {
          isAdmin: !!isAdmin,
          isOwner: isOwner,
          orders: employee?.permissions?.order || {},
          store: employee?.permissions?.store || {}
        }
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployee = () => {
  return useContext(EmployeeContext)
}
