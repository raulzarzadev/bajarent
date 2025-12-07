import { NavigationContainer } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Provider } from 'react-redux'
import AppBootstrap from './src/components/AppBootstrap'
import ErrorBoundary from './src/components/ErrorBoundary'
import { AuthContextProvider } from './src/contexts/authContext'
import { EmployeeContextProvider } from './src/contexts/employeeContext'
import { ItemsProvider } from './src/contexts/itemsContext'
import { OrdersContextProvider } from './src/contexts/ordersContext'
import { StoreContextProvider } from './src/contexts/storeContext'
import { ThemeProvider } from './src/contexts/themeContext'
import { linking } from './src/navigation/linking'
import { ReduxInitializer } from './src/state/ReduxInitializer'
import { store } from './src/state/store'
import { logNavigationStateChange } from './src/utils/navigationLogger'
import { loadNavigationState, persistNavigationState } from './src/utils/navigationPersistence'

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
					linking={linking}
					initialState={initialState}
					onStateChange={state => {
						persistNavigationState(state)
						logNavigationStateChange(state)
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
