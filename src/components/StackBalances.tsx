import { createStackNavigator } from '@react-navigation/stack'
import { BalancesStackParamList } from '../navigation/types'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'
import ScreenBalances from './ScreenBalances'
import ScreenBalancesDetails from './ScreenBalancesDetails'
import ScreenBalancesNew from './ScreenBalancesNew'
import StackOrders from './StackOrders'
import { StackPaymentsE } from './StackPayments'
import { CustomBalanceDateE } from './StoreBalance/CustomBalanceDate'
import ScreenBalance_v3 from './ScreenBalance_v3'

const Stack = createStackNavigator<BalancesStackParamList>()
function StackBalances() {
	return (
		<Stack.Navigator
			id="StackBalances"
			screenOptions={() => {
				return {
					headerRight(props) {
						return <MyStaffLabel />
					}
				}
			}}
		>
			<Stack.Screen
				name="ScreenBalances"
				options={{
					title: 'Cortes de caja'
				}}
				component={ScreenBalances}
			/>
			<Stack.Screen
				name="ScreenBalancesNew"
				options={{
					title: 'Nuevo corte'
				}}
				component={ScreenBalancesNew}
			/>
			<Stack.Screen
				name="CustomBalanceDate"
				options={{
					title: 'Balance por fechas'
				}}
				component={CustomBalanceDateE}
			/>

			<Stack.Screen
				name="ScreenBalancesDetails"
				options={{
					title: 'Detalles de corte'
				}}
				component={ScreenBalancesDetails}
			/>
			<Stack.Screen
				name="ScreenBalance_v3"
				options={{
					title: 'Detalles de corte (custom)'
				}}
				component={ScreenBalance_v3}
			/>
			<Stack.Screen
				name="StackOrders"
				options={{
					title: 'Ordenes',
					headerShown: false
				}}
				component={StackOrders}
			/>
			<Stack.Screen
				name="StackPayments"
				options={{
					title: 'Pagos',
					headerShown: false
				}}
				component={StackPaymentsE}
			/>
		</Stack.Navigator>
	)
}
export const StackBalancesE = props => (
	<ErrorBoundary componentName="StackBalances">
		<StackBalances {...props} />
	</ErrorBoundary>
)
export default StackBalances
