import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import OrderType from '../types/OrderType'
import { listenFullOrderData } from './libs/getFullOrderData'
import { useRoute } from '@react-navigation/native'
import { ServicePayments } from '../firebase/ServicePayments'
import PaymentType from '../types/PaymentType'
import { ServiceComments } from '../firebase/ServiceComments'
import { CommentType } from '../types/CommentType'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { useStore } from './storeContext'
import { CustomerType } from '../state/features/costumers/customerType'
import { ServiceCustomers } from '../firebase/ServiceCustomers'

// Define the shape of the order object
type Order = OrderType

// Define the shape of the context
interface OrderContextProps {
  order?: Order
  setOrder?: (order: Order) => void
  payments?: PaymentType[]
  setPaymentsCount?: (count: number) => void
  setCommentsCount?: (count: number) => void
  paymentsCount?: number
  commentsCount?: number
  customer?: CustomerType
}

// Create the initial context
const OrderContext = createContext<OrderContextProps>({})
let count = 0
// Create the OrderContext provider component
const OrderProvider = ({
  children,
  orderId
}: {
  children: ReactNode
  orderId?: OrderType['id']
}) => {
  const { categories } = useStore()
  const { data: customers, loading: loadingCustomers } = useCustomers()
  const route = useRoute()
  //@ts-ignore
  const _orderId = orderId || route?.params?.orderId
  const [order, setOrder] = useState<Order | null>()
  const [paymentsCount, setPaymentsCount] = useState(2)
  const [payments, setPayments] = useState<PaymentType[]>([])

  const [orderComments, setOrderComments] = useState<CommentType[]>([])
  const [commentsCount, setCommentsCount] = useState(4)

  useEffect(() => {
    if (_orderId) {
      ServicePayments.listenByOrder(_orderId, setPayments, {
        count: paymentsCount
      })
    }
    return () => {}
  }, [_orderId, paymentsCount])

  useEffect(() => {
    if (_orderId) {
      ServiceComments.listenLastByOrder({
        count: commentsCount,
        orderId: _orderId,
        cb: (comments) => {
          setOrderComments(comments)
        }
      })
    }
    return () => {}
  }, [_orderId, commentsCount])

  useEffect(() => {
    if (_orderId) {
      __DEV__ && console.log('orctx', { count, loadingCustomers, categories })
      count++

      listenFullOrderData(_orderId, (order) => {
        // Create a new object instead of mutating directly
        let plainOrder: OrderType = { ...order }

        if (!order) return setOrder(null)

        const customerIsSet = typeof order?.customerId === 'string'
        if (customerIsSet) {
          const ctxCustomer = customers.find((c) => c?.id === order.customerId)
          if (ctxCustomer) {
            plainOrder = {
              ...plainOrder,
              fullName: ctxCustomer.name,
              phone: Object.values(ctxCustomer.contacts)
                .filter((c) => c.type === 'phone')
                .filter((c) => !c.deletedAt) // Fixed: should be !c.deletedAt
                .map((c) => c.value)
                .join(', ')
            }
          }
        }
        //******* SET CATEGORY NAME ITEMS
        const orderItems = order?.items || []

        if (order) return setOrder({ ...plainOrder, items: orderItems })
      })
    }
  }, [_orderId])

  const [customer, setCustomer] = useState<CustomerType>()
  useEffect(() => {
    if (order?.customerId) {
      ServiceCustomers.get(order.customerId).then((customer) => {
        setCustomer(customer)
      })
    }
  }, [order?.customerId, customers])

  return (
    <OrderContext.Provider
      value={{
        order: {
          ...order,
          comments: orderComments,
          payments,
          orderIsNull: order === null
        },
        setOrder,
        payments,
        setPaymentsCount,
        setCommentsCount,
        paymentsCount,
        commentsCount,
        customer: customer || customers.find((c) => c?.id === order?.customerId)
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
export const useOrderDetails = () => useContext(OrderContext)

export { OrderContext, OrderProvider }
