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

  const [orders, setOrders] = useState<OrderType[]>([])
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const [reports, setReports] = useState<CommentType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders, setConsolidatedOrders] =
    useState<ConsolidatedStoreOrdersType>()
  const viewAllOrders =
    !!employee?.permissions?.order?.canViewAll ||
    !!employee?.permissions?.isAdmin

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

  const handleGetOrders = async () => {
    const reportsUnsolved = await ServiceComments?.getReportsUnsolved(storeId)

    if (employee?.permissions?.order?.canViewMy) {
      const orders = await unsolvedOrders(storeId, {
        sections: employee?.sectionsAssigned || []
      })
      const formatted = formatOrders({ orders, reports: reportsUnsolved })
      setOrders(formatted)
    }

    //*<----- FIXME: ------> ***
    //* Admin, Owner, or Employee with permission to view all orders
    // else if (isAdmin || isOwner || employee?.permissions?.order?.canViewAll) {
    //   const orders = await unsolvedOrders(storeId)
    //   const formatted = formatOrders({ orders, reports: reportsUnsolved })
    //   setOrders(formatted)
    // }
  }

  useEffect(() => {
    if (store)
      ServiceComments.listenReportsUnsolved(storeId, (reports) => {
        setReports(reports)
      })
  }, [store])

  const formattedOrders = formatOrders({ orders, reports })

  return (
    <OrdersContext.Provider
      value={{
        orders: formattedOrders,
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
