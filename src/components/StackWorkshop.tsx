import { createStackNavigator } from '@react-navigation/stack'
import type { WorkshopStackParamList } from '../navigation/types'
import ErrorBoundary from './ErrorBoundary'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import { ScreenWorkshopE } from './ScreenWorkshop'
import { ScreenWorkshopHistoryE } from './ScreenWorkshopHistory'
import StackItems from './StackItems'
import StackMyItems from './StackMyItems'
import StackOrders from './StackOrders'

const Stack = createStackNavigator<WorkshopStackParamList>()
function StackWorkshop() {
	return (
		<Stack.Navigator id="StackWorkshop">
			<Stack.Screen
				name="WorkshopHome"
				options={({ route }) => ({
					title: 'Taller'
				})}
				component={withDisabledCheck(ScreenWorkshopE)}
			/>
			<Stack.Screen
				name="WorkshopHistory"
				options={({ route }) => ({
					title: 'Historial de taller'
				})}
				component={ScreenWorkshopHistoryE}
			/>
			<Stack.Screen name="StackOrders" component={StackOrders} options={{ header: () => null }} />
			<Stack.Screen name="StackMyItems" component={StackMyItems} options={{ header: () => null }} />
			<Stack.Screen name="StackItems" component={StackItems} options={{ headerShown: false }} />
		</Stack.Navigator>
	)
}
export const StackWorkshopE = props => (
	<ErrorBoundary componentName="StackWorkshop">
		<StackWorkshop {...props} />
	</ErrorBoundary>
)
export default StackWorkshop
