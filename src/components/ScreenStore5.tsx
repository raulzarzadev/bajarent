import { useRef } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { useShop } from '../hooks/useShop'
import { gSpace, gStyles } from '../styles'
import { CurrentWorkListE } from './CurrentWork/CurrentWorkList'
import DisabledView from './DisabledView'
import ErrorBoundary from './ErrorBoundary'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import ListMovements from './ListMovements'
import Loading from './Loading'
import { ScreenChatbotE } from './ScreenChatbot'
import ScreenItems from './ScreenItems'
import { ScreenStaffE } from './ScreenStaff'
import { BalanceOrders } from './StoreBalance/BalanceOrders'
import { StoreBalanceE } from './StoreBalance/StoreBalance'
import { StoreDetailsE } from './StoreDetails'
import { TabStoreConfiguration } from './TabStoreConfigurationt'
import Tabs from './Tabs'

const ScreenStore = props => {
	const { user } = useAuth()
	const { shop } = useShop()
	const {
		permissions: { isAdmin, isOwner, store: storePermissions, canManageItems, canEditStaff }
	} = useEmployee()

	const scrollViewRef = useRef(null)

	const canViewStaff = isAdmin || isOwner || canEditStaff || storePermissions.disabledStaff

	const canViewCashbox = isAdmin || isOwner || storePermissions.canViewCashbox
	const canViewMovements = isAdmin || isOwner || storePermissions.canViewCashbox

	const CheckedTab = <P extends object>(Tab: React.ComponentType<P>) => {
		const Component = withDisabledCheck(Tab)
		return Component
	}

	const CheckedTabMovements = CheckedTab(TabMovements)
	const CheckedTabStaff = CheckedTab(TabStaff)
	const CheckedTabItems = CheckedTab(TabItems)
	const CheckedTabClients = CheckedTab(TabClients)
	const CheckedTabConfig = CheckedTab(TabStoreConfiguration)
	const CheckedStoreBalance = CheckedTab(StoreBalanceE)

	if (shop === undefined) return <Loading />
	if (shop === null) return <Text>Store not found</Text>

	return (
		<ScrollView ref={scrollViewRef}>
			{!!user && (
				<Tabs
					tabId="screen-store"
					tabs={[
						{
							title: 'Información',
							content: <StoreDetailsE {...props} />,
							show: true,
							icon: 'info'
						},
						{
							title: 'Artículos',
							content: <CheckedTabItems />,
							show: canManageItems,
							icon: 'camera'
						},

						{
							title: 'Balance',
							content: <CheckedStoreBalance />,
							show: canViewCashbox,
							icon: 'balance'
							// icon: 'balance'
						},

						{
							title: 'Staff',
							content: <CheckedTabStaff {...props} />,
							show: canViewStaff,
							icon: 'profile'
							//icon: 'profile'
						},
						{
							title: 'Clientes',
							content: <CheckedTabClients />,
							show: false,
							icon: 'customerCard'
						},
						{
							title: ' Historal',
							content: <CheckedTabMovements />,
							show: canViewMovements,
							icon: 'history'
						},
						{
							title: 'Chatbot',
							content: <ScreenChatbotE />,
							show: isAdmin,
							icon: 'chatbot'
						},
						{
							title: 'Configuración',
							content: <CheckedTabConfig />,
							show: isAdmin,
							icon: 'settings'
						}
					]}
				/>
			)}
		</ScrollView>
	)
}

const TabMovements = () => {
	return (
		<View>
			<Tabs
				tabs={[
					{
						title: 'Ordenes',
						content: <BalanceOrders />,
						show: true
					},
					{
						title: 'Movimientos',
						content: <ListMovements />,
						show: true
					},
					{
						title: 'Trabajo actual',
						content: <CurrentWorkListE />,
						show: true
					}
				]}
			></Tabs>
		</View>
	)
}

const TabClients = () => {
	return <DisabledView />
}

const TabStaff = props => {
	return <ScreenStaffE {...props} />
}

const TabItems = () => {
	return (
		<View style={[gStyles.container, { marginBottom: gSpace(16), maxWidth: 1200 }]}>
			<ScreenItems />
		</View>
	)
}

export default ScreenStore

export const ScreenStoreE = props => {
	return (
		<ErrorBoundary componentName="ScreenStore5">
			<ScreenStore {...props} />
		</ErrorBoundary>
	)
}
