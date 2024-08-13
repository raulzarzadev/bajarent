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
} = {
  isAuthenticated: false,
  user: undefined,
  storeId: '', //*<- get the storeId from localStorage
  setAuth: (value: SetStateAction<typeof initialAutState>) => {}, // Modify the setAuth definition to accept at least one argument
  handleSetStoreId: (storeId: string) => {} // Add the handleSetStoreId function
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

  const getUserStores = async () => {
    if (auth.user) {
      const userStores = await ServiceStores.userStores(auth.user.id)
      setStores(userStores)
    } else {
      setStore(null)
      setStores([])
    }
  }

  useEffect(() => {
    getUserStores()
  }, [auth.user])

  const handleSetStoreId = async (storeId: string) => {
    getUserStores()
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

  const value = useMemo(
    () => ({
      ...auth,
      setAuth,
      storeId,
      stores,
      store,
      handleSetStoreId
    }),
    [auth, setAuth, storeId, stores, store]
  )
  at++
  if (__DEV__) console.log({ at })
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
if (__DEV__) console.log(Platform.OS)
export const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthContextProvider }
