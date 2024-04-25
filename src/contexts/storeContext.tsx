import { createContext, useState, useContext, useEffect, Dispatch } from 'react'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { CommentType, FormattedComment } from '../types/CommentType'
import StaffType, { StaffPermissionType } from '../types/StaffType'
import { setItem } from '../libs/storage'
import { useAuth } from './authContext'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import PaymentType from '../types/PaymentType'
import useStoreDataListen from '../hooks/useStoreDataListen'
import { useEmployee as useEmployee2 } from './employeeContext2'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { ServiceComments } from '../firebase/ServiceComments'
export type StaffPermissions = StaffPermissionType

export type StoreContextType = {
  store?: null | StoreType
  setStore?: Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
  comments?: CommentType[]
  staff?: StoreType['staff']
  myStaffId?: string
  myOrders?: OrderType[]
  userStores?: StoreType[]
  userPositions?: StaffType[]
  handleSetMyStaffId?: (staffId: string) => any
  staffPermissions?: Partial<StaffPermissions>
  storeSections?: SectionType[]
  payments?: PaymentType[]
  categories?: Partial<CategoryType>[]
  updateUserStores?: () => any
  allComments?: FormattedComment[]
  fetchComments?: () => any
  handleToggleJustActiveOrders?: () => any
}

type UseStoreDataListenType = Partial<ReturnType<typeof useStoreDataListen>>

const StoreContext = createContext<StoreContextType & UseStoreDataListenType>(
  {}
)

const StoreContextProvider = ({ children }) => {
  //#region hooks
  const {
    storeId,
    handleSetStoreId,
    store: currentStore,
    stores,
    isAuthenticated
  } = useAuth()

  const {
    employee,
    permissions: {
      orders: { canViewAll: viewAllOrders, canViewMy: justAssignedOrders }
    }
  } = useEmployee2()

  const [reports, setReports] = useState<CommentType[]>([])
  const [justActiveOrders, setJustActiveOrders] = useState<boolean>(true)

  const [allOrders, setAllOrders] = useState<OrderType[]>([])
  const [assignedOrders, setAssignedOrders] = useState<OrderType[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      ServiceComments.listenReportsUnsolved(storeId, setReports)
    }
  }, [employee])

  useEffect(() => {
    if (viewAllOrders) {
      //console.log('all orders')
      handleSetAllOrders().then((res) => {
        setAllOrders(res)
      })
    }
    if (justAssignedOrders) {
      // console.log('assigned orders')
      handleSetEmployeeOrders().then((res) => {
        setAssignedOrders(res)
      })
    }
  }, [employee, reports, justAssignedOrders, justActiveOrders])

  const handleSetAllOrders = async () => {
    return await ServiceOrders.getActives(storeId).then((orders) => {
      console.log({ orders })
      const formattedOrders = formatOrders({
        orders,
        reports,
        justActive: justActiveOrders
      })
      return formattedOrders
    })
  }

  const handleSetEmployeeOrders = async () => {
    //* If the employee has no sections assigned return an empty array
    if (employee?.sectionsAssigned?.length === 0) return []
    //* other way get the orders of the sections assigned to the employee
    return await ServiceOrders.getSectionOrders(
      storeId,
      employee?.sectionsAssigned
    ).then((orders) => {
      const assignedOrders = formatOrders({
        orders,
        reports,
        justActive: justActiveOrders
      })
      return assignedOrders
    })
  }

  const {
    comments,
    sections: storeSections,
    store,
    categories,
    updateCategories,
    handleGetSolvedOrders
  } = useStoreDataListen({ storeId })

  //#region states

  const [myStaffId, setMyStaffId] = useState<string>('')

  const [paymentsFormatted, setPaymentsFormatted] = useState<PaymentType[]>([])

  const [staffPermissions, setStaffPermissions] =
    useState<Partial<StaffPermissions>>(null)

  const handleSetMyStaffId = async (staffId: string) => {
    setMyStaffId(staffId)
    setItem('myStaffId', staffId)
  }

  //#region render

  return (
    <StoreContext.Provider
      value={{
        store,
        storeId,
        handleSetStoreId,
        orders: allOrders,
        comments,
        staff: store?.staff || [],
        myOrders: assignedOrders,
        myStaffId,
        userStores: stores,
        userPositions: [],
        handleSetMyStaffId,
        staffPermissions,
        storeSections,
        payments: paymentsFormatted,
        updateCategories,
        updateUserStores: () => {},
        categories,
        handleGetSolvedOrders,
        handleToggleJustActiveOrders: () =>
          setJustActiveOrders(!justActiveOrders)
        // allComments,
        // fetchComments
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
