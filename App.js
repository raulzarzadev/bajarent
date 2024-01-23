import { NavigationContainer } from '@react-navigation/native'
import BottomAppBar from './src/components/BottomAppBar'
import { AuthContextProvider } from './src/contexts/authContext'

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <BottomAppBar />
      </NavigationContainer>
    </AuthContextProvider>
  )
}
