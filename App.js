import { NavigationContainer } from '@react-navigation/native'
import BottomAppBar from './src/components/BottomAppBar'
import { AuthContextProvider } from './src/contexts/authContext'
import { StoreContextProvider } from './src/contexts/storeContext'

export default function App() {
  return (
    <AuthContextProvider>
      <StoreContextProvider>
        <NavigationContainer>
          <BottomAppBar />
        </NavigationContainer>
      </StoreContextProvider>
    </AuthContextProvider>
  )
}
