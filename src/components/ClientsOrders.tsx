import { ScrollView, StyleSheet, Text } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { gStyles } from '../styles'
import ListOrders from './ListOrders'

const ClientsOrders = ({ clientId }) => {
	const [orders, setOrders] = React.useState([])
	const { storeId } = useStore()
	React.useEffect(() => {
		ServiceOrders.getClientOrders({ clientId, storeId }).then(res => {
			setOrders(res)
		})
	}, [clientId])

	return (
		<ScrollView>
			<Text style={[gStyles.h3, { marginTop: 16 }]}>Ordenes de cliente</Text>
			<ListOrders orders={orders} />
		</ScrollView>
	)
}

export default ClientsOrders

const styles = StyleSheet.create({})
