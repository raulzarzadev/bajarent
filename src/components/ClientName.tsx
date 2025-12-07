import { Text, type TextStyle } from 'react-native'
import type OrderType from '../types/OrderType'

const ClientName = ({ order, style }: { order: Partial<OrderType>; style?: TextStyle }) => {
	const clientName =
		order?.customerName || order?.fullName || `${order?.firstName || ''}${order?.lastName || ''}`
	return <Text style={[style]}>{clientName}</Text>
}

export default ClientName
