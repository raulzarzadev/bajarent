import { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { gStyles } from '../styles'
import ListOrders from './ListOrders'

const ClientsOrders = ({ clientId }) => {
	const [orders, setOrders] = useState([])
	const { storeId } = useStore()

	useEffect(() => {
		ServiceOrders.getClientOrders({ clientId, storeId }).then(res => {
			setOrders(res)
		})
	}, [clientId, storeId])
	return (
		<ScrollView>
			<Text style={[gStyles.h3, { marginTop: 16 }]}>Ordenes de cliente</Text>
			<ListOrders orders={orders} />
		</ScrollView>
	)
}

export default ClientsOrders
