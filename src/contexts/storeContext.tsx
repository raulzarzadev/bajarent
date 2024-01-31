import { createContext, useState, useContext, useEffect, Dispatch } from 'react'
import { ServiceStores } from '../firebase/ServiceStore'
import StoreType from '../types/StoreType'
import OrderType, { order_status } from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { CommentType } from '../types/CommentType'
import { ServiceComments } from '../firebase/ServiceComments'
import orderStatus from '../libs/orderStatus'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceUsers } from '../firebase/ServiceUser'
import StaffType from '../types/StaffType'
import { getItem, setItem } from '../libs/storage'
import { useAuth } from './authContext'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

export type StoreContextType = {
  store?: null | StoreType
  setStore?: Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
  comments?: CommentType[]
  staff?: StoreType['staff']
  myStaffId?: string
  myOrders?: OrderType[]
  userStores?: StoreType[]
  userPositions?: StaffType[]
}
const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  const { user } = useAuth()

  const [storeId, setStoreId] = useState<StoreContextType['store']['id']>(null)

  const [orders, setOrders] = useState<StoreContextType['orders']>([])
  const [comments, setComments] = useState<StoreContextType['comments']>([])
  const [staff, setStaff] = useState<StoreContextType['staff']>([])

  const [orderFormatted, setOrderFormatted] = useState<OrderType[]>([])
  const [staffFormatted, setStaffFormatted] = useState<StaffType[]>([])

  const [userStores, userPositions] = useUserStores()
  const store = useSelectedStore()
  console.log(orders)
  useEffect(() => {
    if (store) {
      ServiceOrders.storeOrders(storeId, setOrders)
      ServiceComments.storeComments(storeId, setComments)
      ServiceStaff.storeStaff(storeId, setStaff)
    }
  }, [store, storeId])

  useEffect(() => {
    if (orders.length > 0) {
      const orderFormatted = [...orders].map((order) => {
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
  }, [orders, comments, staff, store, storeId])

  console.log({ orders, comments, store, storeId })

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

  const myStaffId = staff?.find((s) => s?.userId === user?.id)?.id || ''

  const myOrders =
    [...orderFormatted]
      //* filter orders are assigned to me
      ?.filter((order) => order.assignTo === myStaffId)
      //* filter  orders with status PICKUP
      ?.filter(
        (o: OrderType) =>
          ![
            order_status.PENDING,
            order_status.CANCELLED,
            order_status.PICKUP
          ].includes(o.status)
      ) || []

  const handleSetStoreId = (storeId: string) => {
    setStoreId(storeId)
    setItem('storeId', storeId)
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        storeId,
        handleSetStoreId,
        orders: orderFormatted,
        comments,
        staff: staffFormatted,
        myOrders,
        myStaffId,
        userStores,
        userPositions
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

const useSelectedStore = () => {
  const [store, setStore] = useState<StoreType>()
  useEffect(() => {
    const getStore = async () => {
      const storeId = await getItem('storeId')
      if (storeId) {
        const store = await ServiceStores.get(storeId)
        setStore(store)
      }
    }
    getStore()

    // if store is selected
    // get store details
    // if
  }, [])
  return store
}

const useUserStores = () => {
  const { user } = useAuth()
  const [userStores, setUserStores] = useState([])
  const [userPositions, setUserPositions] = useState<StaffType[]>([])
  useEffect(() => {
    if (user?.id) {
      // get stores where user is  owner

      ServiceStores.getStoresByUserId(user?.id)
        .then((res) => {
          setUserStores(res)
        })
        .catch(console.error)

      // get stores where user is staff

      ServiceStaff.getStaffPositions(user?.id)
        .then(async (res) => {
          const positionsWithStoreData = res.map(async (res) => ({
            store: await ServiceStores.get(res.storeId),
            ...res
          }))
          const positions = await Promise.all(positionsWithStoreData)
          setUserPositions(positions)
        })
        .catch(console.error)
    }
  }, [user])
  return [userStores, userPositions]
}
