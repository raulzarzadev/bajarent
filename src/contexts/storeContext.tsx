import { createContext, useState, useContext, useEffect, Dispatch } from 'react'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { CommentType, FormattedComment } from '../types/CommentType'
import StaffType from '../types/StaffType'
//import { setItem } from '../libs/storage'
import { useAuth } from './authContext'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import PaymentType from '../types/PaymentType'
// import useStoreDataListen from '../hooks/useStoreDataListen'
// import { useEmployee as useEmployee2 } from './employeeContext'
// import { ServiceOrders } from '../firebase/ServiceOrders'
// import { formatOrders } from '../libs/orders'
// import { ServiceComments } from '../firebase/ServiceComments'
import { ServicePayments } from '../firebase/ServicePayments'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceUsers } from '../firebase/ServiceUser'
// export type StaffPermissions = StaffPermissionType

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
  // staffPermissions?: Partial<StaffPermissions>
  storeSections?: SectionType[]
  payments?: PaymentType[]
  categories?: Partial<CategoryType>[]
  updateUserStores?: () => any
  allComments?: FormattedComment[]
  fetchComments?: () => any
  handleToggleJustActiveOrders?: () => any
  fetchOrders?: () => any
  justActiveOrders?: boolean
}

const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { storeId, handleSetStoreId, store, stores, isAuthenticated } =
    useAuth()

  // const {
  //   employee,
  //   permissions: {
  //     isAdmin,
  //     isOwner,
  //     orders: { canViewAll: viewAllOrders, canViewMy: justAssignedOrders }
  //   }
  // } = useEmployee2()

  //const [reports, setReports] = useState<CommentType[]>([])
  const [justActiveOrders, setJustActiveOrders] = useState<boolean>(true)

  // const [allOrders, setAllOrders] = useState<OrderType[]>([])
  // const [assignedOrders, setAssignedOrders] = useState<OrderType[]>([])

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     ServiceComments.listenReportsUnsolved(storeId, setReports)
  //   }
  // }, [employee])

  // useEffect(() => {
  //   fetchOrders()
  // }, [
  //   employee,
  //   reports,
  //   justAssignedOrders,
  //   justActiveOrders,
  //   store?.currentFolio //*<--- we are ensure of this things , this smells like a shit... 😷
  // ])

  // const fetchOrders = () => {
  //   if (viewAllOrders || isOwner) {
  //     //console.log('all orders')
  //     handleSetAllOrders().then((res) => {
  //       setAllOrders(res)
  //     })
  //   }
  //   if (justAssignedOrders) {
  //     // console.log('assigned orders')
  //     handleSetEmployeeOrders().then((res) => {
  //       setAssignedOrders(res)
  //     })
  //   }
  // }
  // const handleSetAllOrders = async () => {
  //   return await ServiceOrders.getActives(storeId).then((orders) => {
  //     const formattedOrders = formatOrders({
  //       orders,
  //       reports,
  //       justActive: justActiveOrders
  //     })
  //     return formattedOrders
  //   })
  // }

  // const handleSetEmployeeOrders = async () => {
  //   //* If the employee has no sections assigned return an empty array
  //   if (employee?.sectionsAssigned?.length === 0) return []
  //   //* other way get the orders of the sections assigned to the employee
  //   return await ServiceOrders.getSectionOrders(
  //     storeId,
  //     employee?.sectionsAssigned
  //   ).then((orders) => {
  //     const assignedOrders = formatOrders({
  //       orders,
  //       reports,
  //       justActive: justActiveOrders
  //     })
  //     return assignedOrders
  //   })
  // }

  const [categories, setCategories] = useState<Partial<CategoryType>[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])

  useEffect(() => {
    if (store) {
      ServiceCategories.listenByStore(store.id, setCategories)
      ServiceSections.listenByStore(store.id, setSections)
      ServiceStaff.listenByStore(store.id, async (staff) => {
        const owner = await ServiceUsers.get(store.createdBy)
        staff.push({ ...owner, userId: owner.id, isOwner: true })
        setStaff(staff)
      })
    }
  }, [store])

  //#region states

  // const [myStaffId, setMyStaffId] = useState<string>('')

  //const [paymentsFormatted, setPaymentsFormatted] = useState<PaymentType[]>([])

  // useEffect(() => {
  //   if (store)
  //     ServicePayments.getByStore(storeId).then((payments) => {
  //       console.log('payments')
  //       setPaymentsFormatted(payments)
  //     })
  // }, [store])

  // const [staffPermissions, setStaffPermissions] =
  //   useState<Partial<StaffPermissions>>(null)

  // const handleSetMyStaffId = async (staffId: string) => {
  //   setMyStaffId(staffId)
  //   setItem('myStaffId', staffId)
  // }

  //#region render

  return (
    <StoreContext.Provider
      value={{
        store,
        storeId,
        handleSetStoreId,
        staff,
        categories,
        userStores: stores,
        storeSections: sections,
        /**
         * @deprecated
         */
        myStaffId: '',
        // staffPermissions,
        /**
         * @deprecated
         */
        justActiveOrders,
        /**
         * @deprecated
         */
        payments: [],
        /**
         * @deprecated
         */
        handleToggleJustActiveOrders: () =>
          setJustActiveOrders(!justActiveOrders),
        //comments,
        /**
         * @deprecated
         */
        handleSetMyStaffId: () => {},
        /**
         * @deprecated
         */
        orders: [],
        /**
         * @deprecated
         */
        myOrders: [],
        /**
         * @deprecated
         */
        userPositions: [],
        /**
         * @deprecated
         */
        // updateCategories: async () => {},
        /**
         * @deprecated
         */
        updateUserStores: () => {}
        /**
         * @deprecated
         */
        // handleGetSolvedOrders: async () => {}

        //fetchOrders
        // allComments,
        // fetchComments
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
