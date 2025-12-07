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
export type ScreenCustomersProps = {}
export const ScreenCustomersE = (props: ScreenCustomersProps) => (
	<ErrorBoundary componentName="ScreenCustomers">
		<ScreenCustomers {...props} />
	</ErrorBoundary>
)
