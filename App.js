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
import { ItemsProvider } from './src/contexts/itemsContext'
import { Provider } from 'react-redux'
import { store } from './src/state/store'
import { ReduxInitializer } from './src/state/ReduxInitializer'

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'
export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [initialState, setInitialState] = useState()

  useEffect(() => {
    if (isReady) return

    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
        if (savedStateString) {
          setInitialState(JSON.parse(savedStateString))
        }
      } catch (e) {
        console.warn('Error restoring navigation state:', e)
      } finally {
        setIsReady(true)
      }
    }

    restoreState()
  }, [])

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
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
                  <ItemsProvider>
                    <ReduxInitializer>
                      <ThemeProvider>
                        <BottomAppBarE />
                      </ThemeProvider>
                    </ReduxInitializer>
                  </ItemsProvider>
                </OrdersContextProvider>
              </EmployeeContextProvider>
            </StoreContextProvider>
          </AuthContextProvider>
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  )
}
