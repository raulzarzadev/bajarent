import { NavigationContainer } from '@react-navigation/native'
import AppBootstrap from './src/components/AppBootstrap'
import { AuthContextProvider, useAuth } from './src/contexts/authContext'
import { StoreContextProvider } from './src/contexts/storeContext'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ThemeProvider } from './src/contexts/themeContext'
import { EmployeeContextProvider } from './src/contexts/employeeContext'
import { OrdersContextProvider } from './src/contexts/ordersContext'
import ErrorBoundary from './src/components/ErrorBoundary'
import { ItemsProvider } from './src/contexts/itemsContext'
import { Provider } from 'react-redux'
import { store } from './src/state/store'
import { ReduxInitializer } from './src/state/ReduxInitializer'
import {
  loadNavigationState,
  persistNavigationState
} from './src/utils/navigationPersistence'

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [initialState, setInitialState] = useState()

  useEffect(() => {
    if (isReady) return

    const restoreState = async () => {
      const state = await loadNavigationState()
      setInitialState(state)
      setIsReady(true)
    }

    restoreState()
  }, [isReady])

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
            persistNavigationState(state)
          }}
        >
          <AuthContextProvider>
            <StoreContextProvider>
              <EmployeeContextProvider>
                <OrdersContextProvider>
                  <ItemsProvider>
                    <ReduxInitializer>
                      <ThemeProvider>
                        <AppBootstrap />
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
