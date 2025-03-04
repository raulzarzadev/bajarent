import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType, {
  PermissionsCustomers,
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
    customers?: PermissionsCustomers
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
  const [disabledEmployee, setDisabledEmployee] = useState<boolean>()

  useEffect(() => {
    if (staff) {
      const employee = staff.find(
        (s) => s.userId === user?.id && s.storeId === storeId
      )

      if (employee) {
        ServiceStaff.listen(employee?.id, (employee) => {
          setEmployee(employee)
          const sectionsAssigned = storeSections
            ?.filter(({ staff }) => staff?.includes(employee?.id))
            .map(({ id }) => id)

          setDisabledEmployee(employee.disabled || null)
          setIsAdmin(employee?.permissions?.isAdmin)
          setIsOwner(store && store?.createdBy === user?.id)
          setAssignedSections(sectionsAssigned)
        })
      } else {
        setEmployee({
          ...user
        })
        setDisabledEmployee(false)
        setIsAdmin(true)
        setIsOwner(true)
        setAssignedSections(null)
      }
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
    const disabledEmployee = employee?.disabled === true
    if (disabledEmployee) {
      setItems([])
    } else {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: canViewAllItems ? 'all' : assignedSections,
        cb: (items) => {
          console.log({ items })
          setItems(formatItems(items, categories, storeSections))
        }
      })
    }
  }, [employee?.disabled, canViewAllItems, assignedSections, disabledEmployee])

  const storePermissions = employee?.permissions?.store || {}

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
        store: storePermissions || {},
        customers: employee?.permissions?.customers || {},

        items: employee?.permissions?.items || {},
        canEditStaff: !!storePermissions?.canEditStaff || isOwner || isAdmin,
        canCancelPayments:
          !!storePermissions?.canCancelPayments || isOwner || isAdmin,
        canValidatePayments:
          isAdmin || isOwner || !!storePermissions?.canValidatePayments,
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
      store?.id,
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
