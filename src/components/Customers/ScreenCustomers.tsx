import { ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'

import { ListCustomersE } from '../ListClients'

const ScreenCustomers = () => {
	return (
		<ScrollView>
			<ListCustomersE />
		</ScrollView>
	)
}
export default ScreenCustomers
export const ScreenCustomersE = () => (
	<ErrorBoundary componentName="ScreenCustomers">
		<ScreenCustomers />
	</ErrorBoundary>
)
