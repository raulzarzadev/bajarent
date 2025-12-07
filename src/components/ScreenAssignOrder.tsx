import { ActivityIndicator, FlatList, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import theme from '../theme'
import H1 from './H1'
import StaffRow from './StaffRow'

const ScreenAssignOrder = ({ route, navigation }) => {
	const orderId = route?.params?.orderId
	const { staff } = useStore()
	const orders = []
	const order = orders.find(({ id }) => id === orderId)
	if (!order) return <ActivityIndicator />
	const handleAssignOrder = (staffId: string) => {
		ServiceOrders.update(orderId, { assignTo: staffId })
			.then(() => {
				// navigation.navigate('OrderDetails', { orderId })
			})
			.catch(console.error)
	}
	const assignTo = order.assignTo || ''
	return (
		<View
			style={{
				maxWidth: 400,
				margin: 'auto',
				paddingVertical: 16,
				width: '100%'
			}}
		>
			<View>
				<H1>Orden asignada a: </H1>
			</View>
			<FlatList
				data={staff}
				renderItem={({ item }) => (
					<StaffRow
						style={{
							borderWidth: 2,
							borderColor: assignTo === item.id ? theme.secondary : 'transparent'
						}}
						staffId={item.id}
						//staff={item}
						// onPress={() => {
						//   handleAssignOrder(item.id)
						// }}
						fields={['name', 'position', 'phone']}
					/>
				)}
				keyExtractor={({ id }) => id}
			/>
		</View>
	)
}

export default ScreenAssignOrder
