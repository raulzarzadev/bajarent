import {
  createContext,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Platform } from 'react-native'
import { ServiceStores } from '../firebase/ServiceStore'
import { removeItem, setItem } from '../libs/storage'
import type StaffType from '../types/StaffType'
import type StoreType from '../types/StoreType'
import type UserType from '../types/UserType'

const STORE_ID_KEY = 'storeId'

type StoresStatus = 'idle' | 'loading' | 'ready' | 'error'

const initialAutState: {
  isAuthenticated: boolean
  user?: null | UserType
  setAuth?: (value: SetStateAction<typeof initialAutState>) => void
  stores?: StoreType[]
  storeId?: string
  storesStatus?: StoresStatus
  storesError?: string | null
  isAuthReady?: boolean
  handleSetStoreId?: (storeId: string) => Promise<void>
  clearStoreSelection?: () => Promise<void>
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
  storesStatus: 'idle',
  storesError: null,
  isAuthReady: false,
  setAuth: (value: SetStateAction<typeof initialAutState>) => {}, // Modify the setAuth definition to accept at least one argument
  handleSetStoreId: async (storeId: string) => {}, // Add the handleSetStoreId function
  clearStoreSelection: async () => {}
  // Add the handleSetUserStores function
}

const AuthContext = createContext(initialAutState)
let at = 0
const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAutState)
  const [storeId, setStoreId] = useState<string>('')
  const [stores, setStores] = useState<StoreType[]>([])
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [storesStatus, setStoresStatus] = useState<StoresStatus>('idle')
  const [storesError, setStoresError] = useState<string | null>(null)

  const persistStoreId = useCallback(async (value: string) => {
    if (value) {
      await setItem(STORE_ID_KEY, value)
    } else {
      await removeItem(STORE_ID_KEY)
    }
  }, [])

  const handleSetStoreId = useCallback(
    async (nextStoreId: string) => {
      const normalized = nextStoreId || ''
      setStoreId(normalized)
      await persistStoreId(normalized)
    },
    [persistStoreId]
  )

  const clearStoreSelection = useCallback(async () => {
    await handleSetStoreId('')
  }, [handleSetStoreId])

  const enhancedSetAuth = useCallback(
    (value: SetStateAction<typeof initialAutState>) => {
      setAuth((prev) => {
        setIsAuthReady(true)
        return typeof value === 'function' ? value(prev) : value
      })
    },
    []
  )

  const handleSetUserStores = async (userId: string) => {
    if (!userId) {
      setStores([])
      setStoresStatus('ready')
      setStoresError(null)
      return
    }
    try {
      setStoresStatus('loading')
      const userStores = await ServiceStores.userStores(userId)
      setStores(userStores || [])
      setStoresStatus('ready')
      setStoresError(null)
    } catch (error) {
      console.error('Error fetching user stores', error)
      setStores([])
      setStoresStatus('error')
      setStoresError(error?.message || 'Error fetching stores')
    }
  }

  useEffect(() => {
    if (storesStatus !== 'ready') return
    if (!stores?.length) {
      // keep storeId empty when there are no stores
      if (storeId) {
        handleSetStoreId('')
      }
      return
    }

    const exists = stores.some((store) => store.id === storeId)
    if (!storeId && stores.length === 1) {
      handleSetStoreId(stores[0].id)
      return
    }
    if (storeId && !exists) {
      handleSetStoreId('')
    }
  }, [storeId, stores, storesStatus, handleSetStoreId])

  const value = useMemo(
    () => ({
      ...auth,
      setAuth: enhancedSetAuth,
      storeId,
      stores,
      storesStatus,
      storesError,
      isAuthReady,
      handleSetStoreId,
      clearStoreSelection,
      handleSetUserStores
    }),
    [
      auth,
      enhancedSetAuth,
      storeId,
      stores,
      storesStatus,
      storesError,
      isAuthReady,
      handleSetStoreId,
      clearStoreSelection
    ]
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
