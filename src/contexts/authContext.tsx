import {
  createContext,
  useState,
  SetStateAction,
  useContext,
  useEffect
} from 'react'
import { authStateChanged } from '../firebase/auth'

const initialAutState = {
  isAuthenticated: false,
  user: null,
  setAuth: (value: SetStateAction<typeof initialAutState>) => {} // Modify the setAuth definition to accept at least one argument
}

const AuthContext = createContext(initialAutState)

const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAutState)

  useEffect(() => {
    authStateChanged((user) => {
      console.log({ user })
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

export const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthContextProvider }
