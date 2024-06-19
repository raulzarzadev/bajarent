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
  handleRefresh?: () => Promise<void> | void
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
  const [orders, setOrders] = useState<OrderType[]>(undefined)
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const viewAllOrders =
    !!employee?.permissions?.order?.canViewAll ||
    !!employee?.permissions?.isAdmin ||
    !!employee?.permissions?.isOwner

  const [reports, setReports] = useState<CommentType[]>([])
  const [important, setImportant] = useState<CommentType[]>([])
  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders, setConsolidatedOrders] =
    useState<ConsolidatedStoreOrdersType>()

  useEffect(() => {
    //* Consolidate orders it useful to search in all orders
    if (viewAllOrders) {
      // ServiceConsolidatedOrders.listenByStore(storeId, (res) => {
      //   setConsolidatedOrders(res[0])
      // })
      handleGetConsolidates()
    }
  }, [viewAllOrders])
  const handleGetConsolidates = async () => {
    return await ServiceConsolidatedOrders.getByStore(storeId).then((res) => {
      const orders = JSON.parse(res[0]?.stringJSON || '{}')
      setConsolidatedOrders({ ...res[0], orders })
    })
  }

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
    ServiceComments.listenImportantUnsolved(storeId, (reports) => {
      setImportant(reports)
    })
  }, [store])

  const viewMyOrders = employee?.permissions?.order?.canViewMy
  const handleGetOrders = async () => {
    await handleGetConsolidates()
    const getExpireTomorrow = !!employee?.permissions?.order?.getExpireTomorrow

    const typeOfOrders = viewAllOrders ? 'all' : viewMyOrders ? 'mine' : 'none'
    if (typeOfOrders === 'all') {
      const storeUnsolvedOrders = await ServiceOrders.getUnsolvedByStore(
        storeId,
        { getBySections: false, sections: [], reports, getExpireTomorrow }
      )
      const formatted = formatOrders({
        orders: storeUnsolvedOrders,
        reports: [...reports, ...important]
      })
      setOrders(formatted)
    } else if (typeOfOrders === 'mine') {
      //* get orders from sections where  sectionsAssigned contains sections
      const orders = await ServiceOrders.getUnsolvedByStore(storeId, {
        getBySections: true,
        sections: employee.sectionsAssigned,
        reports,
        getExpireTomorrow
      })
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

export const useOrdersCtx = () => useContext(OrdersContext)
