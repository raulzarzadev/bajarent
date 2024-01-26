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
import { ServiceUsers } from '../firebase/ServiceUser'

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

  const [staffFormatted, setStaffFormatted] = useState<UserType[]>([])
  useEffect(() => {
    const getStaffDetails = async () => {
      const users = staff.map(
        async ({ userId }) => await ServiceUsers.get(userId)
      )
      const staffFormatted = await Promise.all(users)
      return staffFormatted.map((user) => {
        const userData = {
          name: user.name,
          email: user.email,
          phone: user.phone
          //  photoURL: user.photoURL
        }
        return {
          ...userData,
          ...staff.find(({ userId }) => userId === user.id)
        }
      })
    }
    if (staff.length) getStaffDetails().then(setStaffFormatted)
  }, [staff])

  console.log({ staffFormatted })

  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        storeId,
        handleSetStoreId,
        orders: orderFormatted,
        comments,
        staff: staffFormatted
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
