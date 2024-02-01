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
import StaffType, { StaffPermissionType } from '../types/StaffType'
import { getItem, setItem } from '../libs/storage'
import { useAuth } from './authContext'
import expireDate from '../libs/expireDate'
export type StaffPermissions = StaffPermissionType
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
  handleSetMyStaffId?: (staffId: string) => any
  staffPermissions?: Partial<StaffPermissions>
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
  const [userPositions, setUserPositions] = useState<StaffType[]>([])

  const [myOrders, setMyOrders] = useState<OrderType[]>([])
  const [myStaffId, setMyStaffId] = useState<string>('')

  useEffect(() => {
    if (user?.id) {
      //* get stores where user is  owner

      ServiceStores.getStoresByUserId(user?.id)
        .then((res) => {
          setUserStores(res)
        })
        .catch(console.error)

      //* get stores where user is staff

      ServiceStaff.getStaffPositions(user?.id)
        .then(async (positions) => {
          const positionsWithStoreDataPromises = positions.map(
            async (position) => ({
              ...position,
              store: await ServiceStores.get(position.storeId)
            })
          )
          const positionsWithStore = await Promise.all(
            positionsWithStoreDataPromises
          )
          setUserPositions(positionsWithStore)
        })
        .catch(console.error)
    }
  }, [user])

  const handleSetStoreId = async (storeId: string) => {
    setStoreId(storeId)
    setItem('storeId', storeId)
  }

  useEffect(() => {
    getItem('storeId').then(setStoreId)
  }, [])

  useEffect(() => {
    if (storeId) {
      ServiceStores.get(storeId).then((store) => {
        if (store) {
          setStore(store)
          ServiceOrders.storeOrders(storeId, setOrders)
          ServiceComments.storeComments(storeId, setComments)
          ServiceStaff.storeStaff(storeId, setStaff)
        }
      })
    } else {
      setStore(null)
      setOrders([])
      setComments([])
      setStaff([])
    }
  }, [storeId])

  useEffect(() => {
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
        status: orderStatus(order),
        assignToName: staff?.find((s) => s.id === order.assignTo)?.name,
        assignToPosition: staff?.find((s) => s.id === order.assignTo)?.position,
        expireAt:
          expireDate(order?.item?.priceSelected?.time, order?.deliveredAt) ||
          null
      }
    })
    setOrderFormatted(orderFormatted)
  }, [orders, comments, staff, storeId])

  useEffect(() => {
    const getStaffDetails = async () => {
      const staffs: Promise<StaffType>[] = staff.map(async (employee) => {
        const user = await ServiceUsers.get(employee.userId)
        return {
          staffId: employee.id,
          storeId,
          name: user.name,
          email: user.email,
          // @ts-ignore // FIXME: fix this
          ...employee
        }
      })

      return await Promise.all(staffs)
    }
    if (staff.length) getStaffDetails().then(setStaffFormatted)
  }, [staff])

  useEffect(() => {
    // const staffId = staff?.find((s) => s?.userId === user?.id)?.id || ''
    // setMyStaffId(staffId)
    getItem('myStaffId').then(setMyStaffId)
  }, [])

  useEffect(() => {
    if (myStaffId) {
      const orders =
        orderFormatted
          //* filter orders are assigned to me
          ?.filter((order) => order.assignTo === myStaffId)
          //* filter  orders with status PICKUP
          ?.filter(
            (o: OrderType) =>
              [
                //* show orders EXPIRED, REPORTED, AUTHORIZED
                order_status.AUTHORIZED,
                order_status.EXPIRED,
                order_status.REPORTED
              ].includes(o.status) ||
              //* show orders with reports
              o.hasNotSolvedReports
          ) || []

      setMyOrders(orders)
    }
  }, [myStaffId, orderFormatted])

  const handleSetMyStaffId = async (staffId: string) => {
    setMyStaffId(staffId)
    setItem('myStaffId', staffId)
  }

  const [staffPermissions, setStaffPermissions] =
    useState<Partial<StaffPermissions>>(null)
  useEffect(() => {
    const staffData = staff.find((s) => s.id === myStaffId)
    if (staffData) {
      setStaffPermissions({
        isAdmin: !!staffData?.isAdmin
      })
    } else {
      setStaffPermissions(null)
    }
  }, [user, staff, storeId, myStaffId])
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
        userStores,
        userPositions,
        handleSetMyStaffId,
        staffPermissions
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
