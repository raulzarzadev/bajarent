import { createContext, useState, useContext, useEffect, Dispatch } from 'react'
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
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useEmployee } from './employeeContext'

export type StoreContextType = {
  store?: null | StoreType
  setStore?: Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
  orders?: OrderType[]
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
  justActiveOrders?: boolean
  fetchItems?: () => void
}

const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { storeId, handleSetStoreId, store, stores, isAuthenticated } =
    useAuth()

  const [justActiveOrders, setJustActiveOrders] = useState<boolean>(true)

  const [categories, setCategories] = useState<Partial<CategoryType>[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [storeItems, setStoreItems] = useState<Partial<ItemType>[]>(undefined)

  useEffect(() => {
    if (store) {
      ServiceCategories.listenByStore(store.id, async (categories) => {
        // const pricesCats = await categories.map(async (category) => {
        //   const prices = await ServicePrices.getByCategory(category.id)
        //   category.prices = prices
        //   return category
        // })
        // console.log({ pricesCats })

        const priceCategories = await Promise.all(
          categories.map(async (category) => {
            const prices = await ServicePrices.getByCategory(category.id)
            category.prices = prices
            return category
          })
        )

        setCategories(priceCategories)
      })
      ServiceSections.listenByStore(store.id, setSections)
      ServiceStaff.listenByStore(store.id, async (staff) => {
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
        const ownerIsNotStaff = [...staffUserInfo]?.find(
          (s) => s.id === store.createdBy
        )
        if (ownerIsNotStaff) {
          const owner = await ServiceUsers.get(store.createdBy)
          staff.push({ ...owner, userId: owner.id, isOwner: true })
        }

        setStaff(staffUserInfo)
      })
    }
  }, [store])

  useEffect(() => {
    if (store && categories.length) fetchItems()
  }, [store, categories])

  const fetchItems = async () => {
    const items = await ServiceStoreItems.getAll(store.id)
    setStoreItems(
      items?.map((item) => ({
        ...item,
        id: item.id,
        categoryName:
          categories.find((cat) => cat.id === item.category)?.name || '',
        assignedSectionName:
          sections.find((sec) => sec.id === item.assignedSection)?.name || ''
      })) || []
    )
  }

  //#region render

  const staffWithSections = staff.map((staff) => {
    const sectionsAssigned = sections
      .filter((section) => section?.staff?.includes(staff.id))
      .map((section) => section.id)
    return { ...staff, sectionsAssigned }
  })

  // let items = {}
  // for (let key in store?.items) {
  //   const item = store?.items[key]
  //   item.categoryName =
  //     categories.find((cat) => cat.id === item.category)?.name || ''
  //   item.assignedSectionName =
  //     sections.find((sec) => sec.id === item.assignedSection)?.name || ''
  //   items[key] = item
  // }

  return (
    <StoreContext.Provider
      value={{
        store,
        storeId,
        handleSetStoreId,
        staff: staffWithSections,
        categories,
        userStores: stores,
        storeSections: sections,
        payments,
        /**
         * @deprecated
         */
        items: storeItems,
        /**
         * @deprecated
         */
        fetchItems,
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
