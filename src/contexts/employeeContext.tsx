import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType, {
  PermissionsOrder,
  PermissionsStore
} from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { CategoryType } from '../types/RentItem'
import { SectionType } from '../types/SectionType'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  permissions: {
    isAdmin: boolean
    isOwner: boolean
    orders: Partial<PermissionsOrder>
    store: Partial<PermissionsStore>
    canEditStaff?: boolean
    canManageItems?: boolean
    canCancelPayments?: boolean
    canValidatePayments?: boolean
    canDeleteOrders?: boolean
    canDeleteItems?: boolean
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
  const { store, staff, storeSections, storeId, categories } = useStore()

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

  const [items, setItems] = useState<Partial<ItemType>[]>([])

  useEffect(() => {
    if (employee) {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: employee.sectionsAssigned || [],
        cb: (items) => {
          setItems(formatItems(items, categories, storeSections))
        }
      })
    }
  }, [employee])

  const value = useMemo(
    () => ({
      items,
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
          isAdmin || isOwner || !!employee?.permissions?.order.canDelete,
        canDeleteItems:
          isAdmin || isOwner || !!employee?.permissions?.store?.canDeleteItems,
        canManageItems:
          isAdmin || isOwner || !!employee?.permissions?.store?.canManageItems
      }
    }),
    [employee, isAdmin, isOwner, store, assignedSections, items]
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

const formatItems = (
  items: Partial<ItemType>[],
  categories: CategoryType[],
  sections: SectionType[]
) => {
  return items.map((item) => ({
    ...item,
    id: item.id,
    categoryName:
      categories.find((cat) => cat.id === item.category)?.name || '',
    assignedSectionName:
      sections.find((sec) => sec.id === item.assignedSection)?.name || ''
  }))
}
