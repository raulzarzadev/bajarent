import {
  createContext,
  useState,
  SetStateAction,
  useContext,
  useMemo
} from 'react'
import UserType from '../types/UserType'
import { Platform } from 'react-native'
import StaffType from '../types/StaffType'
import StoreType from '../types/StoreType'
import { setItem } from '../libs/storage'
import { ServiceStores } from '../firebase/ServiceStore'

const initialAutState: {
  isAuthenticated: boolean
  user?: null | UserType
  setAuth?: (value: SetStateAction<typeof initialAutState>) => void
  stores?: StoreType[]
  storeId?: string
  handleSetStoreId?: (storeId: string) => any
  /**
   * @deprecated use employee instead
   */
  store?: StoreType
  /**
   * @deprecated use employee instead
   */
  staff?: StaffType
  handleSetUserStores?: (userId: string) => Promise<void>
} = {
  isAuthenticated: false,
  user: undefined,
  storeId: '', //*<- get the storeId from localStorage
  setAuth: (value: SetStateAction<typeof initialAutState>) => {}, // Modify the setAuth definition to accept at least one argument
  handleSetStoreId: (storeId: string) => {} // Add the handleSetStoreId function
  // Add the handleSetUserStores function
}

const AuthContext = createContext(initialAutState)
let at = 0
const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAutState)
  const [storeId, setStoreId] = useState<string>('')
  const [stores, setStores] = useState<StoreType[]>([])

  const handleSetUserStores = async (userId: string) => {
    const userStores = await ServiceStores.userStores(userId)
    if (userStores && userStores.length > 0) {
      setStores(userStores)
    } else {
      setStores([])
    }
  }
  const handleSetStoreId = async (storeId: string) => {
    if (storeId) {
      setStoreId(storeId)
      setItem('storeId', storeId) //*<- save the storeId in localStorage
    } else {
      setStoreId('')
      setItem('storeId', '') //*<- save the storeId in localStorage
    }
  }

  const value = useMemo(
    () => ({
      ...auth,
      setAuth,
      storeId,
      stores,
      handleSetStoreId,
      handleSetUserStores
    }),
    [auth, setAuth, storeId, stores]
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
