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
      // ServiceConsolidatedOrders.listenByStore(storeId, (res) => {
      //   setConsolidatedOrders(res[0])
      // })
      handleGetConsolidates()
    }
  }, [viewAllOrders])

  const handleGetConsolidates = () => {
    ServiceConsolidatedOrders.getByStore(storeId).then((res) => {
      setConsolidatedOrders(res[0])
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
  }, [store])

  const viewMyOrders = employee?.permissions?.order?.canViewMy
  const handleGetOrders = async () => {
    handleGetConsolidates()
    const typeOfOrders = viewAllOrders ? 'all' : viewMyOrders ? 'mine' : 'none'
    console.log({ typeOfOrders })
    if (typeOfOrders === 'all') {
      const storeUnsolvedOrders = await ServiceOrders.getUnsolvedByStore(
        storeId,
        { getBySections: false, sections: [], reports }
      )
      const formatted = formatOrders({
        orders: storeUnsolvedOrders,
        reports: reports
      })
      setOrders(formatted)
    } else if (typeOfOrders === 'mine') {
      //* get orders from sections where  sectionsAssigned contains sections
      const orders = await ServiceOrders.getUnsolvedByStore(storeId, {
        getBySections: true,
        sections: employee.sectionsAssigned,
        reports
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
