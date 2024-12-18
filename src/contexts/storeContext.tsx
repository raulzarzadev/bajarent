import { createContext, useState, useContext, useEffect } from 'react'
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

export type CurrentBalanceType = {}

export type StoreContextType = {
  store?: null | StoreType
  storeId?: StoreType['id']
  currentBalance?: StoreBalanceType
  prices?: Partial<PriceType>[]
  sections?: SectionType[]
  staff?: StaffType[]
  categories?: Partial<CategoryType>[]
}

let sc = 0
const StoreContext = createContext<StoreContextType>({})
const StoreContextProvider = ({ children }) => {
  const [currentBalance, setCurrentBalance] = useState<StoreBalanceType>()
  //#region hooks
  const { storeId } = useAuth()
  const [store, setStore] = useState<StoreContextType>()

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
      store,
      sections: sectionsWithDefaultStoreSections.sort(sortSections),
      categories: categoriesWithPrices,
      staff: staffWithSections,
      prices
    }
  }

  useEffect(() => {
    if (storeId) {
      getStoreData().then(({ store, categories, sections, staff, prices }) => {
        setStore({
          store,
          categories,
          sections,
          staff,
          prices
        })
      })
    }
  }, [storeId])

  useEffect(() => {
    //* CURRENT BALANCE
    ServiceBalances.listenLastInDate(storeId, new Date(), (balance) =>
      setCurrentBalance(balance)
    )
  }, [store])

  sc++
  if (__DEV__) console.log({ sc })
  //#region render

  return (
    <StoreContext.Provider
      value={{
        ...store,
        storeId,
        currentBalance
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
