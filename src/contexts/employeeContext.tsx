import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType, {
  PermissionsOrder,
  PermissionsStore
} from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  permissions: {
    isAdmin: boolean
    isOwner: boolean
    orders: Partial<PermissionsOrder>
    store: Partial<PermissionsStore>
    canEditStaff?: boolean
    canCancelPayments?: boolean
    canValidatePayments?: boolean
    canDeleteOrders?: boolean
  }
}

const EmployeeContext = createContext<EmployeeContextType>({
  employee: null,
  permissions: { isAdmin: false, isOwner: false, orders: {}, store: {} }
})

let em = 0
export const EmployeeContextProvider = ({ children }) => {
  const { user } = useAuth()
  const { store, staff, storeSections } = useStore()

  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const [assignedSections, setAssignedSections] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(store && store?.createdBy === user?.id)
    const employee = staff?.find(
      ({ userId }) => user?.id && userId === user?.id
    )

    if (employee) {
      const sectionsAssigned = storeSections
        ?.filter(({ staff }) => staff?.includes(employee.id))
        .map(({ id }) => id)
      setIsAdmin(employee?.permissions?.isAdmin)
      setEmployee(employee)
      setAssignedSections(sectionsAssigned)
    } else {
      setEmployee(null)
      setIsAdmin(false)
    }
  }, [staff])

  const value = useMemo(
    () => ({
      employee: employee
        ? { ...employee, sectionsAssigned: assignedSections }
        : undefined,

      permissions: {
        isAdmin: !!isAdmin,
        isOwner: isOwner,
        orders: employee?.permissions?.order || {},
        store: employee?.permissions?.store || {},
        canEditStaff:
          !!employee?.permissions?.store?.canEditStaff || isOwner || isAdmin,
        canCancelPayments:
          !!employee?.permissions?.store?.canCancelPayments ||
          isOwner ||
          isAdmin,
        canValidatePayments:
          isAdmin ||
          isOwner ||
          !!employee?.permissions?.store?.canValidatePayments,
        canDeleteOrders:
          isAdmin || isOwner || !!employee?.permissions?.order.canDelete
      }
    }),
    [employee, isAdmin, isOwner, store, assignedSections]
  )

  em++
  console.log({ em })
  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployee = () => {
  return useContext(EmployeeContext)
}
