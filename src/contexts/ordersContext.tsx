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
  const { storeId } = useAuth()

  const [orders, setOrders] = useState<OrderType[]>([])
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const [reports, setReports] = useState<CommentType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  useEffect(() => {
    ServiceComments.getReportsUnsolved(storeId).then((res) => setReports(res))
  }, [storeId])

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

    if (ordersPermissions?.canViewMy) {
      setFetchTypeOrders('mineUnsolved')
      setOrderTypeOptions([mine, mineSolved, mineUnsolved])
    }

    if (isAdmin || isOwner) {
      setFetchTypeOrders('unsolved')
      setOrderTypeOptions([all, solved, unsolved])
    }
  }, [employee])

  useEffect(() => {
    if (fetchTypeOrders && employee) {
      handleRefresh()
    }
  }, [fetchTypeOrders, employee])

  const handleRefresh = () => {
    if (fetchTypeOrders) {
      handleGetOrdersByFetchType({
        fetchType: fetchTypeOrders,
        sectionsAssigned: employee.sectionsAssigned,
        storeId
      }).then((orders) => {
        const ordersFormatted = formatOrders({ orders, reports })
        setOrders(ordersFormatted)
      })
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
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
  console.log({ fetchType })
  if (fetchType === 'mine') {
    return ServiceOrders.getBySections(sectionsAssigned)
  }
  if (fetchType === 'all') {
    return ServiceOrders.getByStore(storeId)
  }
  if (fetchType === 'solved') {
    return ServiceOrders.getSolved(storeId)
  }
  if (fetchType === 'unsolved') {
    //*<--- 1. with reports
    //*<--- 2. pending
    //*<--- 3. authorized
    //*<----4. rent expired
    //*<----5. repair repairing, repaired ,pickedUp
    try {
      const reportsUnsolved = await ServiceComments.getReportsUnsolved(storeId)
      const reportedOrdersIds = reportsUnsolved
        .map((r) => r.orderId)
        // remove duplicates
        .reduce((acc, curr) => {
          if (!acc.includes(curr)) {
            acc.push(curr)
          }
          return acc
        }, [])
      const pending = await ServiceOrders.getPending(storeId).then((res) => {
        // remove duplicates
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })

      const expired = await ServiceOrders.getExpired(storeId).then((res) => {
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })
      const reported = (await ServiceOrders.getList(reportedOrdersIds)).map(
        (r) => ({ ...r, isReported: true })
      )
      const repairs = await ServiceOrders.getRepairs(storeId).then((res) => {
        // remove duplicates
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })

      return [...pending, ...expired, ...reported, ...repairs]
    } catch (e) {
      console.error(e)
    }
  }
  if (fetchType === 'mineSolved') {
    return ServiceOrders.getMineSolved(storeId, sectionsAssigned)
  }
  if (fetchType === 'mineUnsolved') {
    //*<--- 1. with reports
    //*<--- 2. pending
    //*<--- 3. authorized
    //*<----4. rent expired
    //*<----5. repair repairing, repaired ,pickedUp
    try {
      const reportsUnsolved = await ServiceComments.getReportsUnsolved(storeId)
      const reportedOrdersIds = reportsUnsolved
        .map((r) => r.orderId)
        // * remove duplicates
        .reduce((acc, curr) => {
          if (!acc.includes(curr)) {
            acc.push(curr)
          }
          return acc
        }, [])

      const pending = await ServiceOrders.getPending(storeId, {
        sections: sectionsAssigned
      }).then((res) => {
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })

      const expired = await ServiceOrders.getExpired(storeId, {
        sections: sectionsAssigned
      }).then((res) => {
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })

      const repairs = await ServiceOrders.getRepairs(storeId, {
        sections: sectionsAssigned
      }).then((res) => {
        return res.filter((r) => !reportedOrdersIds.includes(r.id))
      })

      const reported = (
        await ServiceOrders.getList(reportedOrdersIds, {
          sections: sectionsAssigned
        })
      ).map((r) => ({ ...r, isReported: true }))

      return [...pending, ...expired, ...reported, ...repairs]
    } catch (e) {
      console.error(e.message)
    }
  }
  return []
}

export const useOrdersCtx = () => useContext(OrdersContext)
