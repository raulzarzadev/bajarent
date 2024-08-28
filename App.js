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
import ErrorBoundary from './src/components/ErrorBoundary'

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'
export default function App() {
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
    <ErrorBoundary componentName="App">
      <NavigationContainer
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
        }}
      >
        <AuthContextProvider>
          <StoreContextProvider>
            <EmployeeContextProvider>
              <OrdersContextProvider>
                <ThemeProvider>
                  <BottomAppBarE />
                </ThemeProvider>
              </OrdersContextProvider>
            </EmployeeContextProvider>
          </StoreContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </ErrorBoundary>
  )
}
