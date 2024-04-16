import { createContext, useContext, useEffect, useState } from 'react'
import StaffType, { PermissionsOrder } from '../types/StaffType'
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
  const oldOrderPermissions: Record<keyof PermissionsOrder, boolean> = {
    canAssign: !!employee?.canAssignOrder,
    canCreate: !!employee?.canCreateOrder,
    canViewAll: !!employee?.canViewOrders,
    canViewMy: !!employee?.canViewMyOrders,
    canEdit: !!employee?.canEditOrder,
    canDelete: !!employee?.canDeleteOrder,
    canAuthorize: !!employee?.canAuthorizeOrder,
    canRenew: !!employee?.canRenewOrder,
    canCancel: !!employee?.canCancelOrder,
    canPickup: !!employee?.canPickupOrder,
    canDelivery: !!employee?.canDeliveryOrder,
    canStartRepair: false,
    canFinishRepair: false,
    canSentWS: false,
    canReorder: false,
    canUndo: false,
    canUnAuthorize: false
  }
  const newOrderPermissions = employee?.permissions?.order || {}

  /* ********************************************
   *  This code is added to remove the isAdmin key
   *******************************************rz */
  delete newOrderPermissions?.isAdmin

  const mixOrdersPermissions = {
    ...oldOrderPermissions,
    ...newOrderPermissions
  }

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
          isAdmin: !!employee?.permissions?.isAdmin,
          isOwner: isOwner,
          orders: mixOrdersPermissions || {},
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
