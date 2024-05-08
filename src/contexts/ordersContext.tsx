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

  const [fetchTypeOrders, setFetchTypeOrders] =
    useState<FetchTypeOrders>(undefined)

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
    if (fetchTypeOrders) {
      handleGetOrdersByFetchType({
        fetchType: fetchTypeOrders,
        sectionsAssigned: employee.sectionsAssigned,
        storeId
      }).then((orders) => {
        setOrders(orders)
      })
    }
  }, [fetchTypeOrders, employee])

  return (
    <OrdersContext.Provider
      value={{ orders, setFetchTypeOrders, fetchTypeOrders, orderTypeOptions }}
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
