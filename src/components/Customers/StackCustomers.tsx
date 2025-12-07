import { createStackNavigator } from '@react-navigation/stack'
import type { CustomersStackParamList } from '../../navigation/types'
import ErrorBoundary from '../ErrorBoundary'
import MyStaffLabel from '../MyStaffLabel'
import { ScreenCustomerE } from './ScreenCustomer'
import { ScreenCustomerFormE } from './ScreenCustomerForm'
import { ScreenCustomersE } from './ScreenCustomers'

// import StackOrders from '../StackOrders'

const Stack = createStackNavigator<CustomersStackParamList>()

const StackOrdersLazy = props => {
	const StackOrders = require('../StackOrders').default
	return <StackOrders {...props} />
}

export function StackCustomers() {
	return (
		<Stack.Navigator
			id="StackCustomers"
			screenOptions={() => {
				return {
					headerRight(props) {
						return <MyStaffLabel />
					}
				}
			}}
		>
			<Stack.Screen
				name="ScreenCustomers"
				options={{
					title: 'Clientes'
				}}
				component={ScreenCustomersE}
			/>
			<Stack.Screen
				name="ScreenCustomer"
				options={{
					title: 'Detalles de cliente'
				}}
				component={ScreenCustomerE}
			/>
			<Stack.Screen
				name="ScreenCustomerNew"
				options={{
					title: 'Nuevo cliente'
				}}
				component={ScreenCustomerFormE}
			/>
			<Stack.Screen
				name="ScreenCustomerEdit"
				options={{
					title: 'Editar cliente'
				}}
				component={ScreenCustomerFormE}
			/>
			<Stack.Screen
				name="StackOrders"
				component={StackOrdersLazy}
				options={{
					headerShown: false
				}}
			/>
		</Stack.Navigator>
	)
}
export const StackCustomersE = props => (
	<ErrorBoundary componentName="StackCustomers">
		<StackCustomers {...props} />
	</ErrorBoundary>
)
