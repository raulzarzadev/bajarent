import {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  useMemo
} from 'react'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { CommentType, FormattedComment } from '../types/CommentType'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import PaymentType from '../types/PaymentType'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceUsers } from '../firebase/ServiceUser'
import { ServicePrices } from '../firebase/ServicePrices'
import ItemType from '../types/ItemType'
import { PriceType } from '../types/PriceType'

export type StoreContextType = {
  store?: null | StoreType
  setStore?: Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
  /**
   * @deprecated use
   */
  items?: Partial<ItemType>[]
  comments?: CommentType[]
  staff?: StoreType['staff']
  myStaffId?: string
  myOrders?: OrderType[]
  userStores?: StoreType[]
  userPositions?: StaffType[]
  handleSetMyStaffId?: (staffId: string) => any
  storeSections?: SectionType[]
  payments?: PaymentType[]
  categories?: Partial<CategoryType>[]
  updateUserStores?: () => any
  allComments?: FormattedComment[]
  fetchComments?: () => any
  handleToggleJustActiveOrders?: () => any
  fetchOrders?: () => any
  fetchPrices?: () => void
}

let sc = 0
const StoreContext = createContext<StoreContextType>({})
const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { storeId, handleSetStoreId, store, stores } = useAuth()

  const [categories, setCategories] = useState<Partial<CategoryType>[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [storeItems, setStoreItems] = useState<Partial<ItemType>[]>(undefined)

  const [storePrices, setStorePrices] =
    useState<Partial<PriceType>[]>(undefined)
  const fetchPrices = async () => {
    const prices = await ServicePrices.getByStore(storeId)
    setStorePrices(prices)
  }
  useEffect(() => {
    if (storeId) {
      ServiceCategories.listenByStore(storeId, async (categories) => {
        setCategories(categories)
      })
      ServiceSections.listenByStore(storeId, setSections)
      ServiceStaff.listenByStore(storeId, async (staff) => {
        const staffUserInfo = await Promise.all(
          staff.map(async ({ userId, ...rest }) => {
            const user = await ServiceUsers.get(userId)
            const name = user?.name || ''
            const phone = user?.phone || ''
            const email = user?.email || ''
            return {
              ...rest,
              name: name || rest?.position,
              phone,
              email,
              userId: user?.id || ''
            }
          })
        )
        // const ownerIsNotStaff = [...staffUserInfo]?.find(
        //   (s) => s.id === store.createdBy
        // )
        // if (ownerIsNotStaff) {
        //   const owner = await ServiceUsers.get(store.createdBy)
        //   staff.push({ ...owner, userId: owner.id, isOwner: true })
        // }

        setStaff(staffUserInfo)
      })
    }
  }, [storeId])

  // useEffect(() => {
  //   if (store && categories.length) {
  //     fetchItems()
  //     fetchPrices()
  //   }
  // }, [store, categories])

  // const fetchItems = async () => {

  //   setStoreItems([])
  // }

  //#region render

  const staffWithSections = staff.map((staff) => {
    const sectionsAssigned = sections
      .filter((section) => section?.staff?.includes(staff.id))
      .map((section) => section.id)
    return { ...staff, sectionsAssigned }
  })

  const value = useMemo(
    () => ({
      store,
      storeId,
      handleSetStoreId,
      staff: staffWithSections,
      categories: categories.map((cat) => ({
        ...cat,
        prices: storePrices?.filter((p) => p.categoryId === cat.id)
      })),
      userStores: stores,
      storeSections: sections,
      fetchPrices,
      payments,
      /**
       * @deprecated
       */
      items: storeItems,
      /**
       * @deprecated
       */
      // fetchItems,
      /**
       * @deprecated
       */
      myStaffId: '',
      // staffPermissions,

      /**
       * @deprecated
       */
      handleToggleJustActiveOrders: () => {},
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
      updateUserStores: () => {}
      /**
       * @deprecated
       */
    }),
    [
      store,
      storeId,
      handleSetStoreId,
      staffWithSections,
      categories,
      storePrices,
      stores,
      sections,
      fetchPrices,
      payments,
      storeItems
      //fetchItems
    ]
  )
  sc++
  if (__DEV__) console.log({ sc })

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
