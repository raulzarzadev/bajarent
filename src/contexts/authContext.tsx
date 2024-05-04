import {
  createContext,
  useState,
  SetStateAction,
  useContext,
  useEffect,
  useMemo
} from 'react'
import { authStateChanged } from '../firebase/auth'
import UserType from '../types/UserType'
import { Platform } from 'react-native'
import StaffType from '../types/StaffType'
import StoreType from '../types/StoreType'
import { getItem, setItem } from '../libs/storage'
import { ServiceStores } from '../firebase/ServiceStore'
import { getFullStoreData } from './libs/getFullStoreData'

const initialAutState: {
  isAuthenticated: boolean
  user?: null | UserType
  setAuth?: (value: SetStateAction<typeof initialAutState>) => void
  stores?: StoreType[]
  storeId?: string
  handleSetStoreId?: (storeId: string) => any
  store?: StoreType
  /**
   * @deprecated use employee instead
   */
  staff?: StaffType
  fetchStore: () => void | Promise<void>
} = {
  isAuthenticated: false,
  user: undefined,
  storeId: '', //*<- get the storeId from localStorage
  setAuth: (value: SetStateAction<typeof initialAutState>) => {}, // Modify the setAuth definition to accept at least one argument
  handleSetStoreId: (storeId: string) => {}, // Add the handleSetStoreId function
  fetchStore: () => {}
}

const AuthContext = createContext(initialAutState)
let at = 0
const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAutState)
  const [storeId, setStoreId] = useState<string>('')
  const [stores, setStores] = useState<StoreType[]>([])
  const [store, setStore] = useState<StoreType | null>(undefined)

  useEffect(() => {
    authStateChanged((user) => {
      setAuth({ ...auth, isAuthenticated: !!user, user })
    })
    getItem('storeId').then((res) => {
      handleSetStoreId(res)
    })
  }, [])

  useEffect(() => {
    if (auth.user) {
      // Get the user's stores
      ServiceStores.userStores(auth.user.id).then((res) => {
        setStores(res)
      })
      //ServiceStores.listen(storeId, setStore)
    }
    if (!auth.isAuthenticated) {
      setStore(null)
      setStores([])
    }
  }, [auth.user])

  const handleSetStoreId = async (storeId: string) => {
    if (storeId) {
      setStoreId(storeId)
      setItem('storeId', storeId) //*<- save the storeId in localStorage
      ServiceStores.listen(storeId, setStore)
    } else {
      setStoreId('')
      setItem('storeId', '') //*<- save the storeId in localStorage
      setStore(null)
    }
  }

  const fetchStore = async (newStoreId?: string) => {
    // getFullStoreData(newStoreId || storeId).then((storeData) => {
    //   setStore(storeData)
    // })
  }

  const value = useMemo(
    () => ({
      ...auth,
      setAuth,
      storeId,
      stores,
      store,
      fetchStore,
      handleSetStoreId
    }),
    [auth, setAuth, storeId, stores, store]
  )
  at++
  console.log({ at })
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
console.log(Platform.OS)
export const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthContextProvider }
