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
import formatComments from '../libs/formatComments'
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
}

export const OrdersContext = createContext<OrdersContextType>({})

export const OrdersContextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const {
    employee,
    permissions: { orders: ordersPermissions, isOwner, isAdmin }
  } = useEmployee()
  const { storeId, store } = useAuth()
  const { staff } = useStore()
  const [orders, setOrders] = useState<OrderType[]>([])
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const [reports, setReports] = useState<CommentType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const fetchReports = async () => {
    const reports = await ServiceComments.getReportsUnsolved(storeId)
    return reports
  }

  useEffect(() => {
    const all: OrderTypeOption = { label: 'Todas', value: 'all' }
    const solved: OrderTypeOption = { label: 'Resueltas', value: 'solved' }
    const unsolved: OrderTypeOption = {
      label: 'No resueltas',
      value: 'unsolved'
    }
    const mine: OrderTypeOption = { label: 'Mis ordenes', value: 'mine' }
    const mineSolved: OrderTypeOption = {
      label: 'Mis resueltas',
      value: 'mineSolved'
    }

    const mineUnsolved: OrderTypeOption = {
      label: 'Mis no resueltas',
      value: 'mineUnsolved'
    }

    if (isAdmin || isOwner) {
      setFetchTypeOrders('unsolved')
      setOrderTypeOptions([all, solved, unsolved])
    } else if (ordersPermissions?.canViewMy) {
      setFetchTypeOrders('mineUnsolved')
      setOrderTypeOptions([mine, mineSolved, mineUnsolved])
    }
  }, [employee])

  useEffect(() => {
    if (fetchTypeOrders && employee) {
      handleRefresh()
    }
  }, [fetchTypeOrders, employee])

  const handleRefresh = async () => {
    const orders = await handleGetOrdersByFetchType({
      fetchType: fetchTypeOrders,
      sectionsAssigned: employee.sectionsAssigned,
      storeId
    })

    setOrders(orders)
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
        handleRefresh,
        reports
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

const handleGetOrdersByFetchType = async ({
  fetchType,
  sectionsAssigned,
  storeId
}: {
  fetchType: FetchTypeOrders
  sectionsAssigned?: string[]
  storeId?: string
}) => {
  const reportsUnsolved = await ServiceComments.getReportsUnsolved(storeId)
  // 1. get reports

  if (fetchType === 'all') {
    const orders = await ServiceOrders.getByStore(storeId)
    const formatted = formatOrders({ orders, reports: reportsUnsolved })
    return formatted
  }
  if (fetchType === 'solved') {
    const orders = await ServiceOrders.getSolved(storeId)
    const formatted = formatOrders({ orders, reports: reportsUnsolved })
    return formatted
  }
  if (fetchType === 'unsolved') {
    try {
      const orders = await unsolvedOrders(storeId)
      const formatted = formatOrders({ orders, reports: reportsUnsolved })
      return formatted
    } catch (e) {
      console.error(e)
    }
  }
  if (fetchType === 'mine') {
    const orders = await ServiceOrders.getBySections(sectionsAssigned)
    const formatted = formatOrders({ orders, reports: reportsUnsolved })
    return formatted
  }
  if (fetchType === 'mineSolved') {
    const orders = await ServiceOrders.getMineSolved(storeId, sectionsAssigned)
    const formatted = formatOrders({ orders, reports: reportsUnsolved })
    return formatted
  }
  if (fetchType === 'mineUnsolved') {
    try {
      const orders = await unsolvedOrders(storeId, {
        sections: sectionsAssigned
      })
      const formatted = formatOrders({ orders, reports: reportsUnsolved })
      return formatted
    } catch (e) {
      console.error(e.message)
    }
  }
  return []
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
