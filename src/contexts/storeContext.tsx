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
  /**
   * @deprecated
   */
  orders?: OrderType[]
  /**
   * @deprecated use
   */
  items?: Partial<ItemType>[]
  comments?: CommentType[]
  staff?: StoreType['staff']
  /**
   * @deprecated
   */
  myStaffId?: string
  /**
   * @deprecated
   */
  myOrders?: OrderType[]
  /**
   * @deprecated
   */
  userStores?: StoreType[]
  userPositions?: StaffType[]
  /**
   * @deprecated
   */
  handleSetMyStaffId?: (staffId: string) => any
  storeSections?: SectionType[]
  payments?: PaymentType[]
  categories?: Partial<CategoryType>[]
  /**
   * @deprecated
   */
  updateUserStores?: () => any
  allComments?: FormattedComment[]
  fetchComments?: () => any
  /**
   * @deprecated
   */
  handleToggleJustActiveOrders?: () => any
  fetchOrders?: () => any
  fetchPrices?: () => void
  storePrices?: Partial<PriceType>[]
}

let sc = 0
const StoreContext = createContext<StoreContextType>({})
const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { storeId, handleSetStoreId, store, stores } = useAuth()

  const [categories, setCategories] = useState<Partial<CategoryType>[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])

  const [storePrices, setStorePrices] =
    useState<Partial<PriceType>[]>(undefined)

  const fetchPrices = async () => {
    const prices = await ServicePrices.getByStore(storeId, { fromCache: false })
    setStorePrices(prices)
  }

  useEffect(() => {
    if (storeId) {
      fetchPrices()

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
        setStaff(staffUserInfo)
      })
    }
  }, [storeId])

  const staffWithSections = staff.map((staff) => {
    const sectionsAssigned = sections
      .filter((section) => section?.staff?.includes(staff.id))
      .map((section) => section.id)
    return { ...staff, sectionsAssigned }
  })

  //#region useMemo

  const value: StoreContextType = useMemo(
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
      storeSections: [
        ...sections,
        {
          id: 'workshop',
          name: 'Taller',
          storeId,
          description: 'Taller de reparaciones',
          icon: 'tools',
          staff: [],
          createdBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: 'admin'
        }
      ],
      fetchPrices,
      payments: [],
      items: [],
      handleToggleJustActiveOrders: () => {},
      handleSetMyStaffId: () => {},
      orders: [],
      myOrders: [],
      userPositions: [],
      updateUserStores: () => {}
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
      fetchPrices
    ]
  )
  sc++
  if (__DEV__) console.log({ sc })
  //#region render

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
