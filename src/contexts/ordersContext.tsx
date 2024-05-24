import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import OrderType from '../types/OrderType'
import { useEmployee } from './employeeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useAuth } from './authContext'
import { ServiceComments } from '../firebase/ServiceComments'
import { formatOrders } from '../libs/orders'
import { CommentType } from '../types/CommentType'
import {
  ConsolidatedStoreOrdersType,
  ServiceConsolidatedOrders
} from '../firebase/ServiceConsolidatedOrders'
import { useStore } from './storeContext'

export type FetchTypeOrders =
  | 'all'
  | 'solved'
  | 'unsolved'
  | 'mine'
  | 'mineSolved'
  | 'mineUnsolved'

export type OrderTypeOption = { label: string; value: FetchTypeOrders }
export type OrdersContextType = {
  orders?: OrderType[]
  fetchTypeOrders?: FetchTypeOrders
  setFetchTypeOrders?: (fetchType: FetchTypeOrders) => void
  orderTypeOptions?: OrderTypeOption[]
  handleRefresh?: () => void
  reports?: CommentType[]
  consolidatedOrders?: ConsolidatedStoreOrdersType
}

export const OrdersContext = createContext<OrdersContextType>({})

export const OrdersContextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const {
    employee
    //permissions
  } = useEmployee()
  const { storeId, store } = useAuth()
  const { storeSections } = useStore()
  const [orders, setOrders] = useState<OrderType[]>([])
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const viewAllOrders =
    !!employee?.permissions?.order?.canViewAll ||
    !!employee?.permissions?.isAdmin ||
    !!employee?.permissions?.isOwner

  const [reports, setReports] = useState<CommentType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders, setConsolidatedOrders] =
    useState<ConsolidatedStoreOrdersType>()

  useEffect(() => {
    //* Consolidate orders it useful to search in all orders
    if (viewAllOrders) {
      ServiceConsolidatedOrders.listenByStore(storeId, (res) => {
        setConsolidatedOrders(res[0])
      })
    }
  }, [viewAllOrders])

  useEffect(() => {
    if (employee) {
      handleGetOrders()
    }
  }, [employee])

  useEffect(() => {
    if (store)
      ServiceComments.listenReportsUnsolved(storeId, (reports) => {
        setReports(reports)
      })
  }, [store])

  const viewMyOrders = employee?.permissions?.order?.canViewMy
  const handleGetOrders = async () => {
    const typeOfOrders = viewAllOrders ? 'all' : viewMyOrders ? 'mine' : 'none'
    console.log({ typeOfOrders })
    if (typeOfOrders === 'all') {
      //* get orders from all sections
      const orders = await ServiceOrders.getBySectionsUnsolved(
        storeSections.map((s) => s.id)
      )
      const formatted = formatOrders({ orders, reports: reports })
      setOrders(formatted)
    } else if (typeOfOrders === 'mine') {
      //* get orders from sections where  sectionsAssigned contains sections
      const orders = await ServiceOrders.getBySectionsUnsolved(
        employee.sectionsAssigned
      )
      const formatted = formatOrders({ orders, reports: reports })
      setOrders(formatted)
    } else {
      // * do not get any order
      setOrders([])
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        setFetchTypeOrders,
        fetchTypeOrders,
        orderTypeOptions,
        handleRefresh: handleGetOrders,
        reports,
        consolidatedOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

const unsolvedOrders = async (
  storeId: string,
  ops?: { sections?: string[] }
) => {
  const sections = ops?.sections || []
  const reported = await ServiceOrders.getReported(storeId, { sections })
  const pending = await ServiceOrders.getPending(storeId, { sections })
  const expired = await ServiceOrders.getExpired(storeId, { sections })
  const repairs = await ServiceOrders.getRepairsUnsolved(storeId, { sections })
  const unsolved = [...pending, ...expired, ...repairs].filter(
    ({ id }) => !reported.some((r) => r.orderId === id)
  )
  return [...unsolved, ...reported]
}

export const useOrdersCtx = () => useContext(OrdersContext)
