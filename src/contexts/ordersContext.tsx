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

let oc = 0
export const OrdersContext = createContext<OrdersContextType>({})

export const OrdersContextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const { employee, permissions, isEmployee } = useEmployee()
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
    // ServiceConsolidatedOrders.listenByStore(
    //   storeId,
    //   (res) => {
    //     console.log('lisening chunks')
    //     const chunks = res[0]?.consolidatedChunks || []
    //     const promises = chunks.map((chunk) => ServiceChunks.get(chunk))
    //     Promise.all(promises).then((chunksRes) => {
    //       const orders = chunksRes.reduce((acc, chunk) => {
    //         return { ...acc, ...chunk.orders }
    //       }, {})

    //       setConsolidatedOrders({ ...res[0], orders })
    //     })
    //   }
    //)
    return await ServiceConsolidatedOrders.getByStore(storeId).then(
      async (res) => {
        const chunks = res[0]?.consolidatedChunks || []
        const promises = chunks.map((chunk) => ServiceChunks.get(chunk))
        const chunksRes = await Promise.all(promises)
        const orders = chunksRes.reduce((acc, chunk) => {
          return { ...acc, ...chunk.orders }
        }, {})

        setConsolidatedOrders({ ...res[0], orders })
      }
    )
  }

  useEffect(() => {
    if (isEmployee) {
      handleGetOrders()
      handleGetConsolidates()
    }
  }, [isEmployee])

  useEffect(() => {
    if (store) {
      ServiceComments.listenReportsUnsolved(storeId, (reports) => {
        setReports(reports)
      })
      ServiceComments.listenImportantUnsolved(storeId, (reports) => {
        setImportant(reports)
      })
    }
  }, [store])

  const viewMyOrders = employee?.permissions?.order?.canViewMy
  const handleGetOrders = async () => {
    // await handleGetConsolidates()
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
      setOrders([])
    }
  }

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
        consolidatedOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrdersCtx = () => useContext(OrdersContext)
