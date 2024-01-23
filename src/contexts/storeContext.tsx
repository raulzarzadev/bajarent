import { createContext, useState, useContext, useEffect } from 'react'
import UserType from '../types/UserType'
import { ServiceStores } from '../firebase/ServiceStore'
import StoreType from '../types/StoreType'

export type StoreContextType = {
  store?: null | UserType
  setStore?: React.Dispatch<any>
  storeId?: StoreType['id']
  handleSetStoreId?: (storeId: string) => any
}
const StoreContext = createContext<StoreContextType>({})

const StoreContextProvider = ({ children }) => {
  const [store, setStore] = useState<StoreContextType['store']>(null)
  const [storeId, setStoreId] = useState<StoreContextType['store']['id']>(null)

  const handleSetStoreId = (storeId: string) => {
    setStoreId(storeId)
    localStorage.setItem('storeId', storeId)
  }
  useEffect(() => {
    const storeId = localStorage.getItem('storeId')
    setStoreId(storeId)
  }, [])

  useEffect(() => {
    if (storeId) {
      ServiceStores.get(storeId).then(setStore).catch(console.error)
    } else {
      setStore(null)
    }
  }, [storeId])

  return (
    <StoreContext.Provider
      value={{ store, setStore, storeId, handleSetStoreId }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export { StoreContext, StoreContextProvider }
