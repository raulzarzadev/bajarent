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
import { ServicePrices } from '../firebase/ServicePrices'
import ItemType from '../types/ItemType'
import { PriceType } from '../types/PriceType'
import { StoreBalanceType } from '../types/StoreBalance'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceBalances } from '../firebase/ServiceBalances3'

export type CurrentBalanceType = {}

export type StoreContextType = {
  store?: null | StoreType
  storeId?: StoreType['id']
  currentBalance?: StoreBalanceType
  prices?: Partial<PriceType>[]
  sections?: SectionType[]
  staff?: StaffType[]
  categories?: Partial<CategoryType>[]
  /**
   * @deprecated
   */
  handleSetStoreId?: (storeId: string) => any
  /**
   * @deprecated
   */
  setStore?: Dispatch<any>
  /**
   * @deprecated
   */
  orders?: OrderType[]
  /**
   * @deprecated use
   */
  items?: Partial<ItemType>[]
  /**
   * @deprecated
   */
  comments?: CommentType[]

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
  /**
   * @deprecated
   */
  userPositions?: StaffType[]
  /**
   * @deprecated
   */
  handleSetMyStaffId?: (staffId: string) => any
  /**
   * @deprecated
   */
  storeSections?: SectionType[]
  /**
   * @deprecated
   */
  payments?: PaymentType[]

  /**
   * @deprecated
   */
  updateUserStores?: () => any
  /**
   * @deprecated
   */
  allComments?: FormattedComment[]
  /**
   * @deprecated
   */
  fetchComments?: () => any
  /**
   * @deprecated
   */
  handleToggleJustActiveOrders?: () => any
  /**
   * @deprecated
   */
  fetchOrders?: () => any
  /**
   * @deprecated
   */
  fetchPrices?: () => void
  /**
   * @deprecated
   */
  storePrices?: Partial<PriceType>[]
}

let sc = 0
const StoreContext = createContext<StoreContextType>({})
const StoreContextProvider = ({ children }) => {
  const [currentBalance, setCurrentBalance] = useState<StoreBalanceType>()
  //#region hooks
  const { storeId } = useAuth()
  const [store, setStore] = useState<StoreContextType>()
  //const [categories, setCategories] = useState<Partial<CategoryType>[]>([])
  //const [sections, setSections] = useState<SectionType[]>([])
  // const [staff, setStaff] = useState<StaffType[]>([])

  // const [storePrices, setStorePrices] =
  //   useState<Partial<PriceType>[]>(undefined)

  // const fetchPrices = async () => {
  //   const prices = await ServicePrices.getByStore(storeId, { fromCache: false })
  //   setStorePrices(prices)
  // }

  const getStoreData = async () => {
    const storePromise = ServiceStores.get(storeId)
    const categoriesPromise = ServiceCategories.getByStore(storeId)
    const sectionsPromise = ServiceSections.getByStore(storeId)
    const staffPromise = ServiceStaff.getByStore(storeId)
    const pricesPromise = ServicePrices.getByStore(storeId)
    const [store, categories, sections, staff, prices] = await Promise.all([
      storePromise,
      categoriesPromise,
      sectionsPromise,
      staffPromise,
      pricesPromise
    ])
    const categoriesWithPrices = categories.map((cat) => ({
      ...cat,
      prices: prices.filter((p) => p.categoryId === cat.id)
    }))
    const staffWithSections = staff.map((staff) => {
      const sectionsAssigned = sections
        .filter((section) => section?.staff?.includes(staff.id))
        .map((section) => section.id)
      return { ...staff, sectionsAssigned }
    })
    // const sectionsWithDefaultStoreSections = [
    //   ...sections,
    //   {
    //     id: 'workshop',
    //     name: 'Taller',
    //     storeId,
    //     description: 'Taller de reparaciones',
    //     icon: 'tools',
    //     staff: [],
    //     createdBy: 'admin',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     updatedBy: 'admin'
    //   }
    // ]
    return {
      store,
      sections,
      categories: categoriesWithPrices,
      staff: staffWithSections,
      prices
    }
  }

  useEffect(() => {
    if (storeId) {
      getStoreData().then(({ store, categories, sections, staff, prices }) => {
        // console.log({ store, categories, sections, staff, prices })

        setStore({
          store,
          categories,
          sections,
          staff,
          prices
        })
      })
      // //* STORE STAFF
      // ServiceStaff.listenByStore(storeId, async (staff) => {
      //   const staffUserInfo = await Promise.all(
      //     staff.map(async ({ userId, ...rest }) => {
      //       const user = await ServiceUsers.get(userId)
      //       const name = user?.name || ''
      //       const phone = user?.phone || ''
      //       const email = user?.email || ''
      //       return {
      //         ...rest,
      //         name: name || rest?.position,
      //         phone,
      //         email,
      //         userId: user?.id || ''
      //       }
      //     })
      //   )
      //   setStaff(staffUserInfo)
      // })
    }
  }, [storeId])

  useEffect(() => {
    //* CURRENT BALANCE
    ServiceBalances.listenLastInDate(storeId, new Date(), (balance) =>
      setCurrentBalance(balance)
    )
  }, [store])

  // useEffect(() => {
  //   if (storeId) {
  //     ServiceStores.listen(storeId, setStore)
  //     fetchPrices()
  //     //* STORE CATEGORIES
  //     ServiceCategories.listenByStore(storeId, async (categories) => {
  //       setCategories(categories)
  //     })
  //     //* STORE SECTIONS
  //     ServiceSections.listenByStore(storeId, setSections)

  //     //* CURRENT BALANCE
  //     ServiceBalances.listenLastInDate(storeId, new Date(), (balance) =>
  //       setCurrentBalance(balance)
  //     )

  //     //* STORE STAFF
  //     ServiceStaff.listenByStore(storeId, async (staff) => {
  //       const staffUserInfo = await Promise.all(
  //         staff.map(async ({ userId, ...rest }) => {
  //           const user = await ServiceUsers.get(userId)
  //           const name = user?.name || ''
  //           const phone = user?.phone || ''
  //           const email = user?.email || ''
  //           return {
  //             ...rest,
  //             name: name || rest?.position,
  //             phone,
  //             email,
  //             userId: user?.id || ''
  //           }
  //         })
  //       )
  //       setStaff(staffUserInfo)
  //     })
  //   }
  // }, [storeId])

  // const staffWithSections = staff.map((staff) => {
  //   const sectionsAssigned = sections
  //     .filter((section) => section?.staff?.includes(staff.id))
  //     .map((section) => section.id)
  //   return { ...staff, sectionsAssigned }
  // })

  // console.log({ currentBalance })

  //#region useMemo

  // const value: StoreContextType = useMemo(
  //   () => ({
  //     store,
  //     storeId,
  //     currentBalance,
  //     handleSetStoreId,
  //     staff: staffWithSections,
  //     categories: categories.map((cat) => ({
  //       ...cat,
  //       prices: storePrices?.filter((p) => p.categoryId === cat.id)
  //     })),

  //     userStores: stores,
  //     storeSections: [
  //       ...sections,
  //       {
  //         id: 'workshop',
  //         name: 'Taller',
  //         storeId,
  //         description: 'Taller de reparaciones',
  //         icon: 'tools',
  //         staff: [],
  //         createdBy: 'admin',
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         updatedBy: 'admin'
  //       }
  //     ],
  //     fetchPrices,
  //     payments: [],
  //     items: [],
  //     handleToggleJustActiveOrders: () => {},
  //     handleSetMyStaffId: () => {},
  //     orders: [],
  //     myOrders: [],
  //     userPositions: [],
  //     updateUserStores: () => {}
  //   }),
  //   [
  //     store,
  //     storeId,
  //     handleSetStoreId,
  //     staffWithSections,
  //     categories,
  //     storePrices,
  //     stores,
  //     sections,
  //     fetchPrices,
  //     currentBalance
  //   ]
  // )

  //console.log({ store })
  sc++
  if (__DEV__) console.log({ sc })
  //#region render

  return (
    <StoreContext.Provider
      value={{ ...store, storeId, currentBalance }}
      // value={{
      //   store,
      //   storeId,
      //   currentBalance,
      //   handleSetStoreId,
      //   staff: staffWithSections,
      //   categories: categories.map((cat) => ({
      //     ...cat,
      //     prices: storePrices?.filter((p) => p.categoryId === cat.id)
      //   })),

      //   //userStores: stores,
      //   storeSections: [
      //     ...sections,
      //     {
      //       id: 'workshop',
      //       name: 'Taller',
      //       storeId,
      //       description: 'Taller de reparaciones',
      //       icon: 'tools',
      //       staff: [],
      //       createdBy: 'admin',
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //       updatedBy: 'admin'
      //     }
      //   ],
      //   fetchPrices,
      //   payments: [],
      //   items: [],
      //   handleToggleJustActiveOrders: () => {},
      //   handleSetMyStaffId: () => {},
      //   orders: [],
      //   myOrders: [],
      //   userPositions: []
      //   // updateUserStores: () => {}
      // }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
