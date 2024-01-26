import { createContext, useState, useContext, useEffect } from 'react'
import UserType from '../types/UserType'
import { ServiceStores } from '../firebase/ServiceStore'
import StoreType from '../types/StoreType'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { CommentType } from '../types/CommentType'
import { ServiceComments } from '../firebase/ServiceComments'
import orderStatus from '../libs/orderStatus'
import { ServiceStaff } from '../firebase/ServiceStaff'

export type StoreContextType = {
  store?: null | StoreType
  setStore?: React.Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
  comments?: CommentType[]
  staff?: StoreType['staff']
}
const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  const [storeId, setStoreId] = useState<StoreContextType['store']['id']>(null)

  const [store, setStore] = useState<StoreContextType['store']>(null)

  const [orders, setOrders] = useState<StoreContextType['orders']>([])
  const [comments, setComments] = useState<StoreContextType['comments']>([])
  const [staff, setStaff] = useState<StoreContextType['staff']>([])

  const handleSetStoreId = (storeId: string) => {
    setStoreId(storeId)
    AsyncStorage.setItem('storeId', storeId)
  }

  useEffect(() => {
    const setLocalStorage = async () => {
      const storeId = await AsyncStorage.getItem('storeId')
      setStoreId(storeId)
    }
    setLocalStorage()
  }, [])

  useEffect(() => {
    if (store) {
      ServiceOrders.storeOrders(storeId, setOrders)
      ServiceComments.storeComments(storeId, setComments)
      ServiceStaff.storeStaff(storeId, setStaff)
    }
  }, [store])

  useEffect(() => {
    if (storeId) {
      ServiceStores.listen(storeId, setStore)
      //.then(setStore).catch(console.error)
    } else {
      setStore(null)
    }
  }, [storeId])

  const [orderFormatted, setOrderFormatted] = useState<OrderType[]>([])
  useEffect(() => {
    if (orders.length > 0) {
      const orderFormatted = orders.map((order) => {
        const orderComments = comments?.filter(
          (comment) => comment.orderId === order.id
        )
        return {
          ...order,
          hasNotSolvedReports: orderComments?.some(
            (comment) => comment.type === 'report' && !comment.solved
          ),
          comments: orderComments,
          status: orderStatus(order)
        }
      })
      setOrderFormatted(orderFormatted)
    }
  }, [orders, comments, staff])
  console.log({ staff })
  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        storeId,
        handleSetStoreId,
        orders: orderFormatted,
        comments,
        staff
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
