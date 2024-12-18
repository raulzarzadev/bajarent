import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType, {
  PermissionsItems,
  PermissionsOrder,
  PermissionsStore
} from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { formatItems } from '../libs/workshop.libs'
import { ServiceStaff } from '../firebase/ServiceStaff'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null

  disabledEmployee?: boolean
  permissions: {
    canSeeCurrentWork?: boolean
    canCancelPickedUp?: boolean
    isAdmin: boolean
    isOwner: boolean
    orders: Partial<PermissionsOrder>
    store: Partial<PermissionsStore>
    items?: Partial<PermissionsItems>
    canEditStaff?: boolean
    canManageItems?: boolean
    canCancelPayments?: boolean
    canValidatePayments?: boolean
    canDeleteOrders?: boolean
    canDeleteItems?: boolean
    canViewAllOrders?: boolean
    canDeleteExtension?: boolean
    canCreateItems?: boolean
    shouldChooseExactItem?: boolean
    canViewAllItems?: boolean
  }
  items: Partial<ItemType>[]
}

const EmployeeContext = createContext<EmployeeContextType>({
  employee: null,
  permissions: { isAdmin: false, isOwner: false, orders: {}, store: {} },
  items: []
})

let em = 0
export const EmployeeContextProvider = ({ children }) => {
  const { user } = useAuth()
  const {
    store,
    staff,
    sections: storeSections,
    storeId,
    categories
  } = useStore()
  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const [assignedSections, setAssignedSections] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [disabledEmployee, setDisabledEmployee] = useState()

  useEffect(() => {
    if (staff) {
      const employee = staff.find(
        (s) => s.userId === user?.id && s.storeId === storeId
      )
      ServiceStaff.listen(employee?.id, (employee) => {
        setEmployee(employee)
        const sectionsAssigned = storeSections
          ?.filter(({ staff }) => staff?.includes(employee?.id))
          .map(({ id }) => id)
        setDisabledEmployee(employee.disabled)
        setIsAdmin(employee?.permissions?.isAdmin)
        setIsOwner(store && store?.createdBy === user?.id)
        setAssignedSections(sectionsAssigned)
      })
    }
  }, [staff])

  const [items, setItems] = useState<Partial<ItemType>[]>([])

  //* You can view all items if you are an admin, owner or have the permission to view all items
  //* otherwise you can only view the items assigned to your sections
  const canViewAllItems =
    isAdmin || isOwner || !!employee?.permissions?.items?.canViewAllItems
  const canViewAllOrders =
    isAdmin || isOwner || !!employee?.permissions?.order?.canViewAll

  useEffect(() => {
    if (canViewAllItems) {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: 'all',
        cb: (items) => {
          setItems(formatItems(items, categories, storeSections))
        }
      })
    } else {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: assignedSections,
        cb: (items) => {
          setItems(formatItems(items, categories, storeSections))
        }
      })
    }
  }, [canViewAllItems])

  const value = useMemo(
    () => ({
      items,
      employee: employee
        ? { ...employee, sectionsAssigned: assignedSections }
        : undefined,
      disabledEmployee,

      permissions: {
        isAdmin: !!isAdmin || isOwner, //* <--- Owner now is an admin always
        isOwner: isOwner,
        orders: employee?.permissions?.order || {},
        store: employee?.permissions?.store || {},
        items: employee?.permissions?.items || {},
        canSeeCurrentWork: employee?.permissions?.store?.canSeeCurrentWork,
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
          isAdmin || isOwner || !!employee?.permissions?.order?.canDelete,
        canDeleteItems:
          isAdmin || isOwner || !!employee?.permissions?.items?.canDelete,
        canManageItems: canViewAllItems,
        canViewAllOrders,
        canDeleteExtension:
          isAdmin ||
          isOwner ||
          !!employee?.permissions?.order?.canDeleteExtension,
        canCancelPickedUp:
          isAdmin ||
          isOwner ||
          !!employee?.permissions?.order?.canCancelPickedUp,
        canCreateItems:
          !!employee?.permissions?.items?.canCreate || isAdmin || isOwner,
        shouldChooseExactItem:
          employee?.permissions?.order?.shouldChooseExactItem,
        canViewAllItems
      }
    }),
    [
      employee,
      isAdmin,
      isOwner,
      store,
      assignedSections,
      items,
      disabledEmployee
    ]
  )

  em++
  if (__DEV__) console.log({ em })
  return (
    <EmployeeContext.Provider
      value={{
        ...value
        // todayWork
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployee = () => {
  return useContext(EmployeeContext)
}
