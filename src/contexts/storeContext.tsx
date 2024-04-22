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
import useUserStores from '../hooks/useUserStores'
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
}

type UseStoreDataListenType = Partial<ReturnType<typeof useStoreDataListen>>

const StoreContext = createContext<StoreContextType & UseStoreDataListenType>(
  {}
)

const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { storeId, handleSetStoreId, store: currentStore } = useAuth()

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
    ServiceComments.listenReportsUnsolved(storeId, setReports)
  }, [employee])

  useEffect(() => {
    if (viewAllOrders)
      handleSetAllOrders().then((res) => {
        setAllOrders(res)
      })
    if (justAssignedOrders)
      handleSetEmployeeOrders().then((res) => {
        setAssignedOrders(res)
      })
  }, [employee, reports, justAssignedOrders, justAssignedOrders])

  const handleSetAllOrders = async () => {
    return await ServiceOrders.getActives(storeId).then((orders) => {
      const assignedOrders = formatOrders({
        orders,
        reports,
        justActive: justActiveOrders
      })
      return assignedOrders
    })
  }

  const handleSetEmployeeOrders = async () => {
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

  const { userPositions, userStores, updateUserStores } = useUserStores()

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
        userStores,
        userPositions,
        handleSetMyStaffId,
        staffPermissions,
        storeSections,
        payments: paymentsFormatted,
        updateCategories,
        updateUserStores,
        categories,
        handleGetSolvedOrders
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
