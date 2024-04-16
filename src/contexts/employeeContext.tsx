import { createContext, useContext, useEffect, useState } from 'react'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'
export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  permissions: {
    isAdmin: boolean
    isOwner: boolean
    orders: StaffType['permissions']['order']
    store: StaffType['permissions']['store']
  }
}
const EmployeeContext = createContext<EmployeeContextType>({
  employee: null,
  permissions: { isAdmin: false, isOwner: false, orders: {}, store: {} }
})

export const EmployeeContextProvider = ({ children }) => {
  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const { user } = useAuth()
  const { staff, store, storeId } = useStore()
  const isOwner = store?.createdBy === user?.id

  const newOrderPermissions = employee?.permissions?.order || {}
  const isAdmin = employee?.permissions?.isAdmin

  /* ********************************************
   *  This code is added to remove the isAdmin key is Admin is inside of employee.permissions
   *******************************************rz */
  delete newOrderPermissions?.isAdmin

  useEffect(() => {
    const employee = staff?.find((s) => s?.userId === user?.id)
    if (employee) {
      setEmployee({
        isOwner,
        ...employee
      })
    } else {
      setEmployee({
        isOwner,
        name: user?.name,
        phone: user?.phone,
        userId: user?.id,
        storeId,
        email: user?.email
      })
    }
  }, [storeId, user?.id, staff])
  return (
    <EmployeeContext.Provider
      value={{
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
