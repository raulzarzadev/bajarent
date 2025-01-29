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
import { CurrentWorkProvider } from './src/contexts/currentWorkContext'
import { ItemsProvider } from './src/contexts/itemsContext'
import { Provider } from 'react-redux'
import { store } from './src/state/store'

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'
export default function App() {
  const [isReady, setIsReady] = useState(!__DEV__)

  const [initialState, setInitialState] = useState()

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage?.getItem(PERSISTENCE_KEY)
        if (savedStateString === 'undefined') return

        const state = savedStateString
          ? JSON?.parse(savedStateString)
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
      <Provider store={store}>
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
                  <CurrentWorkProvider>
                    <ItemsProvider>
                      <ThemeProvider>
                        <BottomAppBarE />
                      </ThemeProvider>
                    </ItemsProvider>
                  </CurrentWorkProvider>
                </OrdersContextProvider>
              </EmployeeContextProvider>
            </StoreContextProvider>
          </AuthContextProvider>
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  )
}
