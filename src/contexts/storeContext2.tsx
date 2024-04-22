import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import StoreType from '../types/StoreType'
import useStoreDataListen from '../hooks/useStoreDataListen'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { ServicePrices } from '../firebase/ServicePrices'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useAuth } from './authContext'

export type StoreContextType = {
  store?: null | StoreType
  handleSetStoreId?: (storeId: string) => any
  storeId?: StoreType['id']
}

type UseStoreDataListenType = Partial<ReturnType<typeof useStoreDataListen>>

const StoreContext = createContext<StoreContextType & UseStoreDataListenType>(
  {}
)
let lt = 0
const StoreContextProvider = ({ children }) => {
  //#region hooks
  const { user, storeId, handleSetStoreId } = useAuth()
  const [store, setStore] = useState<StoreType>(null)
  //#region effects

  useEffect(() => {
    if (user && storeId) {
      getFullStore(storeId).then((storeData) => {
        setStore(storeData)
      })
    }

    if (user && !storeId) {
      setStore(null)
    }

    if (!user) {
      setStore(null)
    }
  }, [storeId, user])

  //#region render

  const value = useMemo(
    () => ({
      store,
      storeId,
      handleSetStoreId
    }),
    [store, storeId, handleSetStoreId]
  )

  lt++
  console.log({ lt })

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }

const getFullStore = async (storeId) => {
  const store = await getStore(storeId)
  const sections = await getSections(storeId)
  const categories = await getCategories(storeId)
  const prices = await getPrices(storeId)
  const staff = await ServiceStaff.getByStore(storeId)
  const data = {
    ...store,
    sections,
    staff,
    categories: categories.map((c) => ({
      ...c,
      prices: prices.filter((p) => p.categoryId === c.id)
    }))
  }
  return data
}

const getStore = async (storeId) => {
  return await ServiceStores.get(storeId)
}
const getSections = async (storeId) => {
  return await ServiceSections.getByStore(storeId)
}

const getCategories = async (storeId) => {
  return await ServiceCategories.getByStore(storeId)
}

const getPrices = async (storeId) => {
  return await ServicePrices.getByStore(storeId)
}
