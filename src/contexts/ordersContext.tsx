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
import { ServiceChunks } from '../firebase/ServiceChunks'
import { ServicePayments } from '../firebase/ServicePayments'
import { where } from 'firebase/firestore'
import PaymentType from '../types/PaymentType'
import { endDate, startDate } from '../libs/utils-date'

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
  payments?: PaymentType[]
  setOtherConsolidated?: ({
    consolidated
  }: {
    consolidated: ConsolidatedStoreOrdersType
  }) => void
}

let oc = 0
export const OrdersContext = createContext<OrdersContextType>({})

export const OrdersContextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const { employee, permissions, isEmployee, disabledEmployee } = useEmployee()
  const { storeId, store } = useAuth()
  const [orders, setOrders] = useState<OrderType[]>(undefined)
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const viewAllOrders = permissions.canViewAllOrders
  // !!employee?.permissions?.order?.canViewAll ||
  // !!employee?.permissions?.isAdmin ||
  // !!employee?.permissions?.isOwner

  const [reports, setReports] = useState<CommentType[]>([])
  const [important, setImportant] = useState<CommentType[]>([])
  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders, setConsolidatedOrders] =
    useState<ConsolidatedStoreOrdersType>()

  const handleGetConsolidates = async () => {
    ServiceConsolidatedOrders.listenByStore(storeId, async (res) => {
      // console.log('lisening chunks')
      const { orders } = await getChunks({
        chunks: res[0]?.consolidatedChunks || []
      })

      setConsolidatedOrders({ ...res[0], orders })
    })
  }

  const setOtherConsolidated = async ({
    consolidated
  }: {
    consolidated: ConsolidatedStoreOrdersType
  }) => {
    const { orders } = await getChunks({
      chunks: consolidated.consolidatedChunks || []
    })
    setConsolidatedOrders({ ...consolidated, orders })
  }

  const getChunks = async ({ chunks }) => {
    const promises = chunks.map((chunk) => ServiceChunks.get(chunk))
    return await Promise.all(promises).then((chunksRes) => {
      const orders = chunksRes.reduce((acc, chunk) => {
        return { ...acc, ...chunk.orders }
      }, {})
      return { orders }
    })
  }

  useEffect(() => {
    //* is disbaled and is not admin or owner do not get any order
    if (disabledEmployee && !(permissions.isAdmin || permissions.isOwner)) {
      setOrders(null)
      setConsolidatedOrders(null)
    } else {
      handleGetOrders()
      handleGetConsolidates()
    }
  }, [isEmployee, disabledEmployee])

  useEffect(() => {
    if (store) {
      ServiceComments.listenImportantUnsolved(storeId, (reports) => {
        setImportant(reports)
      })
    }
  }, [store])

  const viewMyOrders = employee?.permissions?.order?.canViewMy
  const handleGetOrders = async () => {
    const reportsSolvedToday = await ServiceComments.getReports({
      storeId,
      solvedToday: true
    }).then((res) => {
      return res
    })
    const reportsUnsolved = await ServiceComments.getReports({
      storeId,
      solved: false
    }).then((res) => {
      return res
    })

    setReports([...reportsSolvedToday, ...reportsUnsolved])

    const reports = [...reportsSolvedToday, ...reportsUnsolved]

    const getExpireTomorrow = !!employee?.permissions?.order?.getExpireTomorrow

    const typeOfOrders = viewAllOrders ? 'all' : viewMyOrders ? 'mine' : 'none'
    if (typeOfOrders === 'all') {
      console.log('all orders')
      const storeUnsolvedOrders = await ServiceOrders.getUnsolvedByStore(
        storeId,
        {
          getBySections: false,
          sections: [],
          reports: [...reports, ...important],
          getExpireTomorrow
        }
        //{ fromCache: true }
      ).catch((e) => {
        console.log(e)
        return []
      })

      // console.log({ reports })
      const formatted = formatOrders({
        orders: storeUnsolvedOrders,
        reports: [...reports, ...important]
      })
      setOrders(formatted)
    } else if (typeOfOrders === 'mine') {
      console.log('mine orders')
      //* get orders from sections where  sectionsAssigned contains sections
      const orders = await ServiceOrders.getUnsolvedByStore(
        storeId,
        {
          getBySections: true,
          sections: employee.sectionsAssigned,
          reports: [...reports, ...important],
          getExpireTomorrow
        }
        // { fromCache: true }
      ).catch((e) => {
        console.log(e)
        return []
      })
      const formatted = formatOrders({ orders, reports: reports })
      setOrders(formatted)
    } else {
      console.log('no orders')
      // * do not get any order
      setOrders(null)
    }
  }

  const [payments, setPayments] = useState<PaymentType[]>([])

  const getPayments = async ({ date = new Date() }: { date: Date }) => {
    return await ServicePayments.findMany([
      where('storeId', '==', storeId),
      where('createdAt', '>=', startDate(date)),
      where('createdAt', '<=', endDate(date))
    ])
  }
  useEffect(() => {
    getPayments({ date: new Date() }).then((res) => setPayments(res))
  }, [storeId])

  oc++
  if (__DEV__) console.log({ oc })
  return (
    <OrdersContext.Provider
      value={{
        orders,
        setFetchTypeOrders,
        fetchTypeOrders,
        orderTypeOptions,
        handleRefresh: handleGetOrders,
        reports,
        consolidatedOrders,
        payments,
        setOtherConsolidated
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrdersCtx = () => useContext(OrdersContext)
