import { NavigationContainer } from '@react-navigation/native'
import { BottomAppBarE } from './src/components/BottomAppBar'
import { AuthContextProvider, useAuth } from './src/contexts/authContext'
import { StoreContextProvider } from './src/contexts/storeContext'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemeProvider } from './src/contexts/themeContext'
import { EmployeeContextProvider } from './src/contexts/employeeContext'
import { OrdersContextProvider } from './src/contexts/ordersContext'

export default function App() {
  const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'
  const [isReady, setIsReady] = useState(!__DEV__)

  const [initialState, setInitialState] = useState()

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined

        if (state !== undefined) {
          setInitialState(state)
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    return <ActivityIndicator />
  }
  return (
    <AuthContextProvider>
      <StoreContextProvider>
        <EmployeeContextProvider>
          <OrdersContextProvider>
            <ThemeProvider>
              <NavigationContainer
                initialState={initialState}
                onStateChange={(state) => {
                  AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                }}
              >
                <BottomAppBarE />
              </NavigationContainer>
            </ThemeProvider>
          </OrdersContextProvider>
        </EmployeeContextProvider>
      </StoreContextProvider>
    </AuthContextProvider>
  )
}
