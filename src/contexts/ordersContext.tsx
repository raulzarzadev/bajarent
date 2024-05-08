import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import OrderType from '../types/OrderType'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useAuth } from './authContext'

export type FetchTypeOrders =
  | 'all'
  | 'solved'
  | 'unsolved'
  | 'mine'
  | 'mineSolved'
  | 'mineUnsolved'
export type OrdersContextType = {
  orders?: OrderType[]
  ordersFetch?: FetchTypeOrders
  setFetchTypeOrders?: (fetchType: FetchTypeOrders) => void
}

export const OrdersContext = createContext<OrdersContextType>({})

export const OrdersContextProvider = ({
  children,
  ordersIds
}: {
  children: ReactNode
  ordersIds: string[]
}) => {
  const {
    employee,
    permissions: { orders: ordersPermissions, isOwner, isAdmin }
  } = useEmployee()
  console.log({ ordersIds })
  const { storeId } = useAuth()

  const [orders, setOrders] = useState<OrderType[]>([])

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

  console.log({ fetchTypeOrders })
  useEffect(() => {
    handleGetOrdersByFetchType({
      fetchType: fetchTypeOrders,
      sectionsAssigned: employee.sectionsAssigned,
      storeId
    }).then((orders) => {
      setOrders(orders)
    })
  }, [fetchTypeOrders, employee])

  console.log({ orders, storeId })

  return (
    <OrdersContext.Provider value={{ orders, setFetchTypeOrders }}>
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
    return ServiceOrders.getUnsolved(storeId)
  }
  if (fetchType === 'mineSolved') {
    return ServiceOrders.getMineSolved(storeId, sectionsAssigned)
  }
  if (fetchType === 'mineUnsolved') {
    return ServiceOrders.getMineUnsolved(storeId, sectionsAssigned)
  }
  return []
}

export const useOrdersCtx = () => useContext(OrdersContext)
