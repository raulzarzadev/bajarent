import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ServiceBalances } from '../firebase/ServiceBalances3'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { ServicePrices } from '../firebase/ServicePrices'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceStores } from '../firebase/ServiceStore'
import type { PriceType } from '../types/PriceType'
import type { CategoryType } from '../types/RentItem'
import type { SectionType } from '../types/SectionType'
import type StaffType from '../types/StaffType'
import type { StoreBalanceType } from '../types/StoreBalance'
import type StoreType from '../types/StoreType'
import { useAuth } from './authContext'

export type StoreContextType = {
  store?: null | StoreType
  storeId?: StoreType['id']
  currentBalance?: StoreBalanceType
  prices?: Partial<PriceType>[]
  sections?: SectionType[]
  staff?: StaffType[]
  categories?: Partial<CategoryType>[]
  handleUpdateStore?: () => void //! TODO: this is so bad, shuold be removed or refactored
  isStoreReady?: boolean
  //! *<----- Thing this can be avoid if we use the redux
}

let sc = 0
const StoreContext = createContext<StoreContextType>({})
const StoreContextProvider = ({ children }) => {
  const [currentBalance, setCurrentBalance] = useState<StoreBalanceType>()
  //#region hooks
  const { storeId, isAuthenticated, user } = useAuth()
  const [storeCtx, setStoreCtx] = useState<StoreContextType>()
  const [store, setStore] = useState<StoreType>()
  useEffect(() => {
    if (!storeId || !isAuthenticated) {
      setStore(undefined)
      setStoreCtx(undefined)
      setCurrentBalance(undefined)
    }
  }, [storeId, isAuthenticated])
  const handleUpdateStore = async () => {
    getStoreData(storeId)
      .then(({ categories, sections = [], staff, prices }) => {
        setStoreCtx({
          categories,
          sections,
          staff,
          prices
        })
      })
      .catch((e) => console.error({ e }))
  }

  useEffect(() => {
    if (storeId && isAuthenticated) {
      const unsubscribe = ServiceStores.listen(storeId, (store) => {
        setStore(store)
      })
      return () => unsubscribe && unsubscribe()
    }
  }, [storeId, isAuthenticated])

  useEffect(() => {
    if (storeId && isAuthenticated) {
      handleUpdateStore()
    }
  }, [storeId, isAuthenticated])

  useEffect(() => {
    //* CURRENT BALANCE
    if (store?.id && isAuthenticated) {
      const unsubscribe = ServiceBalances.listenLastInDate(
        { storeId: store?.id, date: new Date(), type: 'daily' },
        (balance) => setCurrentBalance(balance)
      )
      return () => unsubscribe && unsubscribe()
    }
  }, [store?.id, isAuthenticated])

  sc++
  if (__DEV__) console.log({ sc })
  //#region render
  const storeReady = Boolean(storeId && store && storeCtx)
  const value = useMemo(() => {
    return {
      ...storeCtx,
      store,
      storeId,
      currentBalance,
      handleUpdateStore,
      isStoreReady: storeReady
    }
  }, [storeCtx, store, storeId, currentBalance, storeReady])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }

const sortSections = (a, b) => {
  // put default areas first
  if (a.defaultArea && !b.defaultArea) {
    return -1
  }
  if (!a.defaultArea && b.defaultArea) {
    return 1
  }
  // then sort by name
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

/**
 * @deprecated use getStoreFullData from ServiceStores
 * @param storeId
 * @returns
 */
export const getStoreData = async (storeId: string) => {
  const storePromise = ServiceStores.get(storeId)
  const categoriesPromise = ServiceCategories.getByStore(storeId)
  const sectionsPromise = ServiceSections.getByStore(storeId)
  const pricesPromise = ServicePrices.getByStore(storeId)
  const [store, categories = [], sections = [], prices = []] =
    await Promise.all([
      storePromise,
      categoriesPromise,
      sectionsPromise,
      pricesPromise
    ])
  const staff = store?.staff || []
  const categoriesWithPrices = categories?.map((cat) => ({
    ...cat,
    prices: prices.filter((p) => p.categoryId === cat.id)
  }))
  const staffWithSections = staff.map((staff) => {
    const sectionsAssigned = sections
      .filter((section) => section?.staff?.includes(staff.id))
      .map((section) => section.id)
    return { ...staff, sectionsAssigned }
  })
  const sectionsWithDefaultStoreSections = [...sections]

  return {
    sections: sectionsWithDefaultStoreSections.sort(sortSections),
    categories: categoriesWithPrices,
    staff: staffWithSections,
    prices
  }
}
