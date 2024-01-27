import { createContext, useState, useContext, useEffect } from 'react'
import { ServiceStores } from '../firebase/ServiceStore'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { CommentType } from '../types/CommentType'
import { ServiceComments } from '../firebase/ServiceComments'
import orderStatus from '../libs/orderStatus'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceUsers } from '../firebase/ServiceUser'
import StaffType from '../types/StaffType'
import { getItem, setItem } from '../libs/storage'
import { useAuth } from './authContext'

export type StoreContextType = {
  store?: null | StoreType
  setStore?: React.Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
  comments?: CommentType[]
  staff?: StoreType['staff']
  myStaffId?: string
  myOrders?: OrderType[]
  userStores?: StoreType[]
}
const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  const { user } = useAuth()

  const [storeId, setStoreId] = useState<StoreContextType['store']['id']>(null)

  const [store, setStore] = useState<StoreContextType['store']>(null)

  const [orders, setOrders] = useState<StoreContextType['orders']>([])
  const [comments, setComments] = useState<StoreContextType['comments']>([])
  const [staff, setStaff] = useState<StoreContextType['staff']>([])

  const [orderFormatted, setOrderFormatted] = useState<OrderType[]>([])
  const [staffFormatted, setStaffFormatted] = useState<StaffType[]>([])

  const [userStores, setUserStores] = useState([])

  useEffect(() => {
    if (user) {
      ServiceStores.getStoresByUserId(user?.id)
        .then(setUserStores)
        .catch(console.error)
    }
  }, [user])

  const handleSetStoreId = (storeId: string) => {
    setStoreId(storeId)
    setItem('storeId', storeId)
  }

  useEffect(() => {
    const setLocalStorage = async () => {
      const storeId = await getItem('storeId')
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

  useEffect(() => {
    const getStaffDetails = async () => {
      const staffs: Promise<StaffType>[] = staff.map(
        async ({
          userId,
          storeId,
          id,
          createdAt,
          createdBy,
          position,
          updatedAt,
          updatedBy
        }) => {
          const user = await ServiceUsers.get(userId)
          return {
            id,
            userId,
            staffId: id,
            storeId,
            createdAt,
            createdBy,
            position,
            name: user.name,
            email: user.email,
            updatedAt,
            updatedBy
          }
        }
      )

      return await Promise.all(staffs)
    }
    if (staff.length) getStaffDetails().then(setStaffFormatted)
  }, [staff])

  const myStaffId = staff?.find((s) => s.userId === user.id)?.id || ''
  const myOrders =
    orderFormatted?.filter((order) => order.assignTo === myStaffId) || []

  return (
    <StoreContext.Provider
      value={{
        store,
        setStore,
        storeId,
        handleSetStoreId,
        orders: orderFormatted,
        comments,
        staff: staffFormatted,
        myOrders,
        myStaffId,
        userStores
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
