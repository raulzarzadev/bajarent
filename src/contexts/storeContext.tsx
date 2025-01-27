import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import StoreType from '../types/StoreType'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServicePrices } from '../firebase/ServicePrices'
import { PriceType } from '../types/PriceType'
import { StoreBalanceType } from '../types/StoreBalance'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceBalances } from '../firebase/ServiceBalances3'
import { useDispatch } from 'react-redux'
import { fetchCustomers } from '../app/features/costumers/customersThunks'
import { AppDispatch } from '../app/store'

export type StoreContextType = {
  store?: null | StoreType
  storeId?: StoreType['id']
  currentBalance?: StoreBalanceType
  prices?: Partial<PriceType>[]
  sections?: SectionType[]
  staff?: StaffType[]
  categories?: Partial<CategoryType>[]
  handleUpdateStore?: () => void //! TODO: this is so bad, shuold be removed or refactored
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
  const handleUpdateStore = async () => {
    getStoreData(storeId)
      .then(({ categories, sections, staff, prices }) => {
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
    if (storeId && isAuthenticated)
      ServiceStores.listen(storeId, (store) => {
        store.staff = storeCtx?.staff
        setStore(store)
      })
  }, [storeId, storeCtx?.staff, isAuthenticated])

  useEffect(() => {
    if (storeId && isAuthenticated) {
      handleUpdateStore()
    }
  }, [storeId, isAuthenticated])

  useEffect(() => {
    //* CURRENT BALANCE
    if (store?.id && isAuthenticated)
      ServiceBalances.listenLastInDate(store?.id, new Date(), (balance) =>
        setCurrentBalance(balance)
      )
  }, [store?.id, isAuthenticated])

  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  //->>>

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (store?.id) {
      // get customers
      dispatch(fetchCustomers({ storeId: store.id }))
    }
  }, [dispatch, store?.id])

  //->>>
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************

  sc++
  if (__DEV__) console.log({ sc })
  //#region render
  const value = useMemo(() => {
    return {
      ...storeCtx,
      store,
      storeId,
      currentBalance,
      handleUpdateStore
    }
  }, [storeCtx, store, storeId, currentBalance])
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

const getStoreData = async (storeId: string) => {
  //const storePromise = ServiceStores.get(storeId)
  const categoriesPromise = ServiceCategories.getByStore(storeId)
  const sectionsPromise = ServiceSections.getByStore(storeId)
  const staffPromise = ServiceStaff.getByStore(storeId)
  const pricesPromise = ServicePrices.getByStore(storeId)
  const [
    //store,
    categories,
    sections,
    staff,
    prices
  ] = await Promise.all([
    // storePromise,
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
  const sectionsWithDefaultStoreSections = [
    ...sections,
    {
      id: 'workshop',
      name: 'Taller',
      storeId,
      description: 'Taller de reparaciones',
      icon: 'tools',
      defaultArea: true
    }
  ]

  return {
    sections: sectionsWithDefaultStoreSections.sort(sortSections),
    categories: categoriesWithPrices,
    staff: staffWithSections,
    prices
  }
}
