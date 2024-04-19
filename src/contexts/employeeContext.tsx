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
  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const { user } = useAuth()
  const { staff, store, storeId, orders, storeSections } = useStore()
  const isOwner = !!store && !!user && store?.createdBy === user?.id

  const newOrderPermissions = employee?.permissions?.order || {}
  const isAdmin = employee?.permissions?.isAdmin

  /* ********************************************
   *  This code is added to remove the isAdmin key is Admin is inside of employee.permissions
   *******************************************rz */
  delete newOrderPermissions?.isAdmin

  useEffect(() => {
    const employee = staff?.find((s) => s?.userId === user?.id)
    if (!employee) return setEmployee(null)
    setEmployee({
      ...employee,
      isOwner
    })
  }, [storeId, user?.id, staff])

  const [myOrders, setMyOrders] = useState(orders)

  useEffect(() => {
    if (employee?.id) {
      const orders = getEmployeeOrders(employee?.id)
      setMyOrders(orders)
    }
  }, [orders, employee?.id, storeSections, staff])

  const getEmployeeOrders = (employeeId: string) => {
    //* find section of the employee are assigned
    const employeeSectionsAssigned = storeSections
      ?.filter((s) => s.staff.includes(employeeId))
      ?.map((s) => s.id)
    //* find orders are assigned to the sections
    const sectionOrders = orders?.filter(
      (o) =>
        o.assignToSection &&
        employeeSectionsAssigned?.includes(o.assignToSection)
    )
    return sectionOrders
  }
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
