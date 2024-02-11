import { NavigationContainer } from '@react-navigation/native'
import BottomAppBar from './src/components/BottomAppBar'
import { AuthContextProvider } from './src/contexts/authContext'
import { StoreContextProvider } from './src/contexts/storeContext'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemeProvider } from './src/contexts/themeContext'

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
        <ThemeProvider>
          <NavigationContainer
            initialState={initialState}
            onStateChange={(state) => {
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }}
          >
            <BottomAppBar />
          </NavigationContainer>
        </ThemeProvider>
      </StoreContextProvider>
    </AuthContextProvider>
  )
}
