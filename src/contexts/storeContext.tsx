import { createContext, useState, useContext, useEffect, Dispatch } from 'react'
import StoreType from '../types/StoreType'
import OrderType, { order_status } from '../types/OrderType'
import { CommentType } from '../types/CommentType'
import orderStatus from '../libs/orderStatus'
import { ServiceUsers } from '../firebase/ServiceUser'
import StaffType, {
  StaffPermissionType,
  staff_permissions
} from '../types/StaffType'
import { getItem, setItem } from '../libs/storage'
import { useAuth } from './authContext'
import expireDate from '../libs/expireDate'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import PaymentType from '../types/PaymentType'
import useStoreDataListen from '../hooks/useStoreDataListen'
import useUserStores from '../hooks/useUserStores'
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
  storeSections?: SectionType[]
  payments?: PaymentType[]
  categories?: Partial<CategoryType>[]
  updateUserStores?: () => any
}

type UseStoreDataListenType = Partial<ReturnType<typeof useStoreDataListen>>

const StoreContext = createContext<StoreContextType & UseStoreDataListenType>(
  {}
)

const StoreContextProvider = ({ children }) => {
  const { user } = useAuth()

  const [storeId, setStoreId] = useState<StoreContextType['store']['id']>(null)

  const {
    comments,
    orders,
    payments,
    sections: storeSections,
    staff,
    store,
    categories,
    updateCategories,
    handleGetSolvedOrders
  } = useStoreDataListen({ storeId })

  const { userPositions, userStores, updateUserStores } = useUserStores()

  const [orderFormatted, setOrderFormatted] = useState<OrderType[]>([])
  const [staffFormatted, setStaffFormatted] = useState<StaffType[]>([])

  const [myOrders, setMyOrders] = useState<OrderType[]>([])
  const [myStaffId, setMyStaffId] = useState<string>('')

  const [paymentsFormatted, setPaymentsFormatted] = useState<PaymentType[]>([])

  const [staffPermissions, setStaffPermissions] =
    useState<Partial<StaffPermissions>>(null)

  const handleSetStoreId = async (storeId: string) => {
    setStoreId(storeId)
    setItem('storeId', storeId)
  }

  const handleSetMyStaffId = async (staffId: string) => {
    setMyStaffId(staffId)
    setItem('myStaffId', staffId)
  }

  useEffect(() => {
    getItem('myStaffId').then(setMyStaffId)
  }, [])

  useEffect(() => {
    getItem('storeId').then(setStoreId)
  }, [])

  useEffect(() => {
    //* ** FORMAT ORDERS  */
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
          expireDate(
            order?.item?.priceSelected?.time,
            order?.deliveredAt,
            order?.item?.priceSelected
          ) || null,
        payments: payments.filter((p) => p.orderId === order.id) || []
      }
    })
    setOrderFormatted(orderFormatted)
  }, [orders, comments, staff, storeId, payments, payments])

  useEffect(() => {
    const getStaffDetails = async () => {
      const staffs: Promise<StaffType>[] = staff.map(async (employee) => {
        const user = await ServiceUsers.get(employee.userId)
        return {
          // @ts-ignore // FIXME: fix this
          ...employee,
          staffId: employee.id,
          storeId,
          name: user.name,
          email: user.email
        }
      })

      return await Promise.all(staffs)
    }
    if (staff.length) getStaffDetails().then(setStaffFormatted)
  }, [staff])

  useEffect(() => {
    if (myStaffId) {
      const myCurrentPosition = staff?.find((s) => s.id === myStaffId)
      const myCurrentSections = storeSections.filter((s) =>
        s?.staff?.includes(myCurrentPosition?.id)
      )
      const orders =
        orderFormatted

          ?.filter(
            (order) =>
              //* filter orders are assigned to my section
              !!myCurrentSections.find((s) => s.id === order.assignToSection) ||
              //* filter orders are assigned to me
              order?.assignToStaff === myStaffId
          )
          //* filter  orders with status PICKUP
          ?.filter(
            (o: OrderType) =>
              [
                //* show orders EXPIRED, REPORTED, AUTHORIZED
                order_status.AUTHORIZED,
                order_status.EXPIRED,
                order_status.REPORTED,
                order_status.REPAIRING,
                order_status.REPAIRED
              ].includes(o.status) ||
              //* show orders with reports
              o.hasNotSolvedReports
          ) || []
      setMyOrders(orders)
    }
  }, [myStaffId, orderFormatted])

  useEffect(() => {
    const staffData = staff.find((s) => s.id === myStaffId)
    if (staffData) {
      const permissions = {}
      Object.keys(staff_permissions).forEach((key) => {
        permissions[key] = !!staffData[key]
      })
      setStaffPermissions(permissions)
    } else {
      setStaffPermissions(null)
    }
  }, [user, staff, storeId, myStaffId])

  useEffect(() => {
    //* ** FORMAT PAYMENTS WITH THE CLIENT NAME */
    setPaymentsFormatted(
      payments.map((p) => {
        const order = orders.find((o) => o.id === p.orderId)
        return {
          ...p,
          clientName: order?.fullName || order?.firstName || '',
          orderFolio: order?.folio || 0
        }
      })
    )
  }, [payments, orders])

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
        userPositions,
        handleSetMyStaffId,
        staffPermissions,
        storeSections,
        payments: paymentsFormatted,
        updateCategories,
        updateUserStores,
        categories,
        handleGetSolvedOrders
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
