import {
  createContext,
  useState,
  SetStateAction,
  useContext,
  useEffect
} from 'react'
import { authStateChanged } from '../firebase/auth'
import UserType from '../types/UserType'
import { Platform } from 'react-native'
import StaffType from '../types/StaffType'

const initialAutState: {
  isAuthenticated: boolean
  user?: null | UserType
  setAuth?: (value: SetStateAction<typeof initialAutState>) => void
  /**
   * @deprecated use employee instead
   */
  staff?: StaffType
} = {
  isAuthenticated: false,
  user: undefined,
  setAuth: (value: SetStateAction<typeof initialAutState>) => {} // Modify the setAuth definition to accept at least one argument
}

const AuthContext = createContext(initialAutState)

const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAutState)
  // const [staff, setStaff] = useState<StaffType | null>(null)
  useEffect(() => {
    authStateChanged((user) => {
      setAuth({ isAuthenticated: !!user, user })
    })
    // Check if the user is logged in
    // If so, update the auth state
  }, [])

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
console.log(Platform.OS)

export const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthContextProvider }
