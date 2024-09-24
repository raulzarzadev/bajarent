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
import { CategoryType } from '../types/RentItem'
import { SectionType } from '../types/SectionType'
import asDate, { endDate, startDate } from '../libs/utils-date'
import { isToday } from 'date-fns'
import PaymentType from '../types/PaymentType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'
import { ServicePayments } from '../firebase/ServicePayments'
import { ServiceComments } from '../firebase/ServiceComments'
import { where } from 'firebase/firestore'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  todayWork?: {
    pickedUp: OrderType[]
    delivered: OrderType[]
    renewed: OrderType[]
    payments: PaymentType[]
    resolvedReports?: OrderType[]
    handleUpdate: () => void
    authorizedOrders: OrderType[]
  }
  isEmployee?: boolean
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
  // const FROM_DATE = startDate(new Date())
  // const TO_DATE = endDate(new Date())
  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const [assignedSections, setAssignedSections] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  // const [payments, setPayments] = useState<PaymentType[]>([])
  const [loading, setLoading] = useState(false)
  const [disabledEmployee, setDisabledEmployee] = useState(employee?.disabled)
  const [isEmployee, setIsEmployee] = useState(false)
  // const [resolvedReports, setResolvedReports] = useState<OrderType[]>([])
  // const [authorizedOrders, setAuthorizedOrders] = useState<OrderType[]>([])
  const handleUpdate = () => {
    console.log('updating orders from employee')
    setLoading(true)
    handleGetOrders()
    handleGetPayments()
  }
  const date = new Date()
  useEffect(() => {
    if (user) handleUpdate()
  }, [user])

  const userId = user?.id

  // const [pickedUp, setPickedUp] = useState<OrderType[]>([])
  // const [delivered, setDelivered] = useState<OrderType[]>([])
  // const [renewed, setRenewed] = useState<OrderType[]>([])

  const handleGetOrders = () => {
    // ServiceOrders.getDelivered(
    //   {
    //     storeId,
    //     userId,
    //     fromDate: startDate(date),
    //     toDate: endDate(date)
    //   },
    //   {
    //     justRefs: true
    //     // fromCache: true
    //   }
    // ).then((orders) => {
    //   setDelivered(orders)
    // })
    // ServiceOrders.getRenewed(
    //   {
    //     storeId,
    //     userId,
    //     fromDate: startDate(date),
    //     toDate: endDate(date)
    //   },
    //   {
    //     justRefs: true
    //     //fromCache: true
    //   }
    // ).then((orders) => {
    //   setRenewed(orders)
    // })
    // ServiceOrders.getPickedUp(
    //   {
    //     storeId,
    //     userId,
    //     fromDate: startDate(date),
    //     toDate: endDate(date)
    //   },
    //   {
    //     justRefs: true
    //     // fromCache: true
    //   }
    // ).then((orders) => {
    //   setPickedUp(orders)
    // })
    // ServiceComments.findMany(
    //   [
    //     where('type', '==', 'report'),
    //     where('solved', '==', true),
    //     where('solvedAt', '>=', FROM_DATE),
    //     where('solvedAt', '<=', TO_DATE)
    //   ]
    //   //{ fromCache: getFromCache.solvedReports }
    // ).then(setResolvedReports)
    // ServiceOrders.getAuthorized({
    //   storeId,
    //   sections: canViewAllOrders ? 'all' : assignedSections
    // }).then((orders) => {
    //   setAuthorizedOrders(orders)
    // })
  }

  const handleGetPayments = () => {
    // ServicePayments.getBetweenDates(
    //   {
    //     fromDate: startDate(new Date()),
    //     toDate: endDate(new Date()),
    //     storeId,
    //     userId
    //   }
    //   //{ fromCache: true }
    // )
    //   .then(setPayments)
    //   .catch(console.error)
  }

  useEffect(() => {
    setIsOwner(store && store?.createdBy === user?.id)
    const employee = staff?.find(
      ({ userId }) => user?.id && userId === user?.id
    )

    if (employee) {
      setDisabledEmployee(employee.disabled)
      setIsEmployee(true)
      const sectionsAssigned = storeSections
        ?.filter(({ staff }) => staff?.includes(employee?.id))
        .map(({ id }) => id)
      setIsAdmin(employee?.permissions?.isAdmin)
      setEmployee(employee)
      setAssignedSections(sectionsAssigned)
    } else {
      setIsEmployee(false)
    }
  }, [staff])

  useEffect(() => {
    if (isOwner) {
      setEmployee({
        ...user
      })
    }
  }, [isOwner])

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
  }, [isEmployee])

  const value = useMemo(
    () => ({
      items,
      employee: employee
        ? { ...employee, sectionsAssigned: assignedSections }
        : undefined,
      isEmployee,
      disabledEmployee,

      permissions: {
        isAdmin: !!isAdmin,
        isOwner: isOwner,
        orders: employee?.permissions?.order || {},
        store: employee?.permissions?.store || {},
        items: employee?.permissions?.items || {},
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

  // const todayWork = {
  //   pickedUp: pickedUp,
  //   delivered: delivered,
  //   renewed: renewed,
  //   resolvedReports,
  //   payments,
  //   handleUpdate,
  //   authorizedOrders
  // }

  // console.log({ todayWork })

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

export const formatItems = (
  items: Partial<ItemType>[],
  categories: Partial<CategoryType>[],
  sections: SectionType[]
) => {
  return items.map((item) => ({
    ...item,
    id: item?.id,
    categoryName:
      categories.find((cat) => cat.id === item?.category)?.name || '',
    assignedSectionName:
      sections.find((sec) => sec.id === item?.assignedSection)?.name || '',
    needFix: !!item.needFix,
    isRented: !!(item?.status === 'rented'),
    isPickedUp: !!(item?.status === 'pickedUp'),
    checkedInInventory: isToday(asDate(item.lastInventoryAt))
  }))
}
