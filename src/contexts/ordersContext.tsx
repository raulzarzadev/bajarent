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
  orders?: Partial<OrderType>[]
  fetchTypeOrders?: FetchTypeOrders
  setFetchTypeOrders?: (fetchType: FetchTypeOrders) => void
  orderTypeOptions?: OrderTypeOption[]
  handleRefresh?: () => Promise<void> | void
  reports?: CommentType[]
  consolidatedOrders?: ConsolidatedStoreOrdersType
  repairOrders?: unknown[]
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
  const { storeId, isAuthenticated } = useAuth()
  const { store } = useStore()
  const { employee, permissions, disabledEmployee } = useEmployee()
  const [orders, setOrders] = useState<Partial<OrderType>[]>(undefined)
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const [reports, setReports] = useState<CommentType[]>([])
  const [important, setImportant] = useState<CommentType[]>([])
  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders, setConsolidatedOrders] =
    useState<ConsolidatedStoreOrdersType>()

  const handleGetConsolidates = async () => {
    if (store)
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
    if (isAuthenticated && (!disabledEmployee || permissions.isAdmin)) {
      handleGetOrders()
      handleGetConsolidates()
    } else {
      setImportant([])
      setReports([])
      setOrders(null)
      setConsolidatedOrders(null)
    }
  }, [disabledEmployee, isAuthenticated])

  const handleGetOrders = async () => {
    const commentImportantAndReports =
      await ServiceComments.getUnsolvedImportantAndReports(storeId)

    const getExpireTomorrow = !!employee?.permissions?.order?.getExpireTomorrow

    const typeOfOrders = permissions.canViewAllOrders
      ? 'all'
      : permissions.orders.canViewMy
      ? 'mine'
      : 'none'

    if (typeOfOrders === 'all') {
      console.log('all orders')
      const storeUnsolvedOrders = await ServiceOrders.getUnsolvedByStore(
        storeId,
        {
          getBySections: false,
          sections: [],
          reports: commentImportantAndReports,
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
        reports: commentImportantAndReports
      })
      setOrders(formatted)
    } else if (typeOfOrders === 'mine') {
      console.log('mine orders')
      //* get orders from sections where  sectionsAssigned contains sections
      const orders = await ServiceOrders.getUnsolvedByStore(storeId, {
        getBySections: true,
        sections: employee.sectionsAssigned,
        reports: commentImportantAndReports,
        getExpireTomorrow
      }).catch((e) => {
        console.log(e)
        return []
      })
      const formatted = formatOrders({
        orders: orders,
        reports: commentImportantAndReports
      })
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
      where('storeId', '==', store?.id),
      where('createdAt', '>=', startDate(date)),
      where('createdAt', '<=', endDate(date))
    ])
  }
  useEffect(() => {
    if (store?.id && isAuthenticated)
      getPayments({ date: new Date() }).then((res) => setPayments(res))
  }, [store?.id && isAuthenticated])
  const [repairOrders, setRepairOrders] = useState<unknown[]>([])
  useEffect(() => {
    if (storeId && isAuthenticated) {
      ServiceOrders.listenRepairUnsolved({ storeId, cb: setRepairOrders })
    }
  }, [storeId, isAuthenticated])

  oc++
  if (__DEV__) console.log({ oc })
  return (
    <OrdersContext.Provider
      value={{
        orders,
        repairOrders,
        setFetchTypeOrders,
        fetchTypeOrders,
        orderTypeOptions,
        handleRefresh: handleGetOrders,
        reports: [...reports, ...important],
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
