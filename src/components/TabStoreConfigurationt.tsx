import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { ScreenOrdersConfigE } from './ScreenOrdersConfig'
import Tabs from './Tabs'
import { useEmployee } from '../contexts/employeeContext'
import ButtonDownloadCSV from './ButtonDownloadCSV'
import { AppErrorLogs } from './StoreBalance/AppErrorLogs'
import { useAuth } from '../contexts/authContext'
import { ConfigItemsViewE } from './ConfigItemsView'

export const TabStoreConfiguration = () => {
	const { user } = useAuth()
	return (
		<Tabs
			tabId="tab-store-config"
			tabs={[
				{
					title: 'Items',
					content: <ConfigItemsViewE />,
					show: true,
					icon: 'camera'
				},
				{
					title: 'Ordenes',
					content: <ScreenOrdersConfigE />,
					show: true,
					icon: 'orders'
				},
				{
					title: 'Respaldos',
					content: <BackupsTab />,
					show: true,
					icon: 'backup'
				},
				{
					title: 'Errores',
					content: <AppErrorLogs />,
					// @ts-ignore roles is added dynamically to employee object. this roles is different from user roles
					show: !!user?.roles?.includes('SUPER_ADMIN')
				}
			]}
		></Tabs>
	)
}

export type TabStoreConfigurationProps = {}
export const TabStoreConfigurationE = (props: TabStoreConfigurationProps) => (
	<ErrorBoundary componentName="TabStoreConfiguration">
		<TabStoreConfiguration {...props} />
	</ErrorBoundary>
)

const BackupsTab = () => {
	const {
		permissions: { isAdmin, isOwner }
	} = useEmployee()
	return (
		<View style={{ padding: 16, maxWidth: 600, margin: 'auto' }}>
			<ButtonDownloadCSV />
		</View>
	)
}
