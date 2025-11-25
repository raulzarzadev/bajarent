import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react'
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
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceStores } from '../firebase/ServiceStore'
import { formatItems } from '../libs/workshop.libs'
import { useShop } from '../hooks/useShop'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null

  disabledEmployee?: boolean
  isEmployeeReady?: boolean
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
  const { user, storeId } = useAuth()
  const { shop } = useShop()
  const { sections: storeSections, categories } = useStore()

  const [items, setItems] = useState<Partial<ItemType>[]>([])
  const ownerProvisionedStoreId = useRef<string | null>(null)

  const shopStaff = shop?.staff || []
  const employee = shopStaff.find(
    (s) => s.userId === user?.id && s.storeId === storeId
  )
  const assignedSectionsRaw = employee?.sectionsAssigned
  const assignedSections = useMemo(
    () => assignedSectionsRaw || [],
    [assignedSectionsRaw]
  )
  const isAdmin = employee?.permissions?.isAdmin || false
  const isOwner = shop && shop?.createdBy === user?.id

  const disabledEmployee = !!employee?.disabled

  //* You can view all items if you are an admin, owner or have the permission to view all items
  //* otherwise you can only view the items assigned to your sections
  const canViewAllItems =
    isAdmin || isOwner || !!employee?.permissions?.items?.canViewAllItems
  const canViewAllOrders =
    isAdmin || isOwner || !!employee?.permissions?.order?.canViewAll

  useEffect(() => {
    if (!storeId) {
      setItems([])
    }
  }, [storeId])

  useEffect(() => {
    const storeIdentifier = shop?.id
    if (
      !isOwner ||
      employee ||
      !storeIdentifier ||
      !user?.id ||
      ownerProvisionedStoreId.current === storeIdentifier
    )
      return

    let cancelled = false
    const provisionOwner = async () => {
      try {
        const ownerStaff: Partial<StaffType> = {
          userId: user.id,
          storeId: storeIdentifier,
          name: user?.name || 'Propietario',
          email: user?.email || '',
          phone: user?.phone || '',
          rol: 'admin',
          roles: {
            admin: true,
            technician: false,
            driver: false,
            reception: false
          },
          permissions: {
            isOwner: true,
            isAdmin: true
          }
        }

        await ServiceStores.addStaff({
          storeId: storeIdentifier,
          staff: ownerStaff
        })
        await ServiceStaff.addStaffToStore(storeIdentifier, ownerStaff)

        if (!cancelled) ownerProvisionedStoreId.current = storeIdentifier
      } catch (error) {
        console.error('Error provisioning owner as staff', error)
      }
    }

    provisionOwner()
    return () => {
      cancelled = true
    }
  }, [isOwner, employee, shop?.id, user?.id])

  useEffect(() => {
    if (!employee) return
    const disabledEmployee = employee?.disabled === true
    let unsubscribe: any
    if (disabledEmployee) {
      setItems([])
    } else {
      unsubscribe = ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: canViewAllItems ? 'all' : assignedSections,
        cb: (items) => {
          setItems(formatItems(items, categories, storeSections))
        }
      })
    }
    return () => unsubscribe && unsubscribe()
  }, [
    employee?.disabled,
    canViewAllItems,
    assignedSections,
    disabledEmployee,
    storeId,
    categories,
    storeSections
  ])

  const storePermissions = employee?.permissions?.store || {}

  const employeeReady = Boolean(
    storeId && shop !== undefined && (isOwner || employee)
  )

  const value = useMemo(
    () => ({
      items,
      employee: employee
        ? { ...employee, sectionsAssigned: assignedSections }
        : undefined,
      disabledEmployee,
      isEmployeeReady: employeeReady,

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
      shop?.id,
      assignedSections,
      items,
      disabledEmployee,
      employeeReady,
      canViewAllItems,
      canViewAllOrders
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
