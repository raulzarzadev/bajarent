import { createStackNavigator } from '@react-navigation/stack'
import { OrdersStackParamList } from '../navigation/types'
import { ScreenOrdersE } from './ScreenOrders'
import { ScreenOrderDetailE } from './ScreenOrderDetail'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'
import ScreenOrderRenew from './ScreenOrderRenew2'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderReorder from './ScreenOrderReorder'
import { StackPaymentsE } from './StackPayments'
import StackItems from './StackItems'
import { ScreenMessagesE } from './ScreenMessages'
import ScreenOrderNew from './ScreenOrderNew'
import { StackCustomersE } from './Customers/StackCustomers'
import { StackCurrentWorkE } from './StackCurrentWork'

const Stack = createStackNavigator<OrdersStackParamList>()
function StackOrders() {
	return (
		<Stack.Navigator
			id="StackOrders"
			screenOptions={props => {
				return {
					headerRight(props) {
						return <MyStaffLabel />
					}
				}
			}}
		>
			<Stack.Screen
				name="ScreenOrders"
				options={({ route }) => ({
					title: route?.params?.title ?? 'Mis ordenes' //*<-- Title change if is from pedidos, reportes, balance details and more
				})}
				component={ScreenOrdersE}
			/>

			<Stack.Screen
				name="OrderDetails"
				options={{
					title: 'Detalles de orden'
				}}
				component={ScreenOrderDetailE}
			/>

			<Stack.Screen
				name="EditOrder"
				options={{
					title: 'Editar Orden'
				}}
				component={ScreenOrderEdit}
			/>

			<Stack.Screen
				name="AssignOrder"
				options={{
					title: 'Asignar Orden'
				}}
				component={ScreenAssignOrder}
			/>

			<Stack.Screen
				name="RenewOrder"
				options={{
					title: 'Renovar Orden'
				}}
				component={ScreenOrderRenew}
			/>
			<Stack.Screen
				name="ReorderOrder"
				options={{
					title: 'Re ordenar '
				}}
				component={ScreenOrderReorder}
			/>
			<Stack.Screen
				name="ScreenNewOrder"
				component={ScreenOrderNew}
				options={{
					title: 'Nueva Orden'
					// tabBarButton: () => null
				}}
			/>
			<Stack.Screen
				name="ScreenSelectedOrders"
				options={({ route }) => ({
					title: route?.params?.title ?? 'Ordenes seleccionadas'
				})}
				component={ScreenOrdersE}
			/>

			{/* 
//* Consolidated orders
*/}

			{/* ------ NESTED STACKS  */}
			<Stack.Screen
				name="StackCustomers"
				options={{
					title: 'Clientes',
					headerShown: false
				}}
				component={StackCustomersE}
			/>

			<Stack.Screen
				name="StackPayments"
				options={{
					title: 'Pagos',
					headerShown: false
				}}
				component={StackPaymentsE}
			/>

			<Stack.Screen
				name="StackItems"
				options={{
					title: 'Items',
					headerShown: false
					//tabBarButton: () => null
				}}
				component={StackItems}
			/>
			<Stack.Screen
				name="ScreenMessages"
				options={({ route }) => ({
					title: route?.params?.title || 'Mensajería' //*<-- Title change if is from pedidos, reportes, balance details and more
				})}
				component={ScreenMessagesE}
			/>
			<Stack.Screen
				name="StackCurrentWork"
				options={{
					title: 'Trabajo Actual',
					headerShown: false
				}}
				component={StackCurrentWorkE}
			/>
		</Stack.Navigator>
	)
}
export default StackOrders
