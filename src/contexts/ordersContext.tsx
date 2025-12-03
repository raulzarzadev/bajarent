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
import { ConsolidatedStoreOrdersType } from '../firebase/ServiceConsolidatedOrders'
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
  /**
   * @deprecated DO NOT USE CONSOLIDATED ORDERS IN NEW CODE
   */
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
  const { employee, permissions } = useEmployee()
  const [orders, setOrders] = useState<Partial<OrderType>[]>(undefined)
  const [orderTypeOptions, setOrderTypeOptions] = useState<OrderTypeOption[]>(
    []
  )

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  const [consolidatedOrders] = useState<ConsolidatedStoreOrdersType>()

  const setOtherConsolidated = async ({
    consolidated
  }: {
    consolidated: ConsolidatedStoreOrdersType
  }) => {
    console.log('esto no deberia ejecutarse')
  }

  const [payments, setPayments] = useState<PaymentType[]>([])

  const getPayments = async ({ date = new Date() }: { date: Date }) => {
    return await ServicePayments.findMany([
      where('storeId', '==', store?.id),
      where('createdAt', '>=', startDate(date)),
      where('createdAt', '<=', endDate(date))
    ])
  }
  // useEffect(() => {
  //   if (store?.id && isAuthenticated) {
  //     getPayments({ date: new Date() }).then((res) => setPayments(res))
  //   }
  // }, [store?.id && isAuthenticated])

  const [repairOrders, setRepairOrders] = useState<unknown[]>([])

  // useEffect(() => {
  //   if (storeId && isAuthenticated) {
  //     ServiceOrders.listenRepairUnsolved({ storeId, cb: setRepairOrders })
  //   }
  // }, [storeId, isAuthenticated])

  oc++
  if (__DEV__) console.log({ oc })
  const value = {
    orders,
    repairOrders,
    setFetchTypeOrders,
    fetchTypeOrders,
    orderTypeOptions,
    handleRefresh: () => console.error('handleRefresh no implementado'),
    reports: [],
    consolidatedOrders,
    payments,
    setOtherConsolidated
  }

  console.log({ value })
  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export const useOrdersCtx = () => useContext(OrdersContext)
