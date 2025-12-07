import { useState } from 'react'
import { View } from 'react-native'
import { useOrderDetails } from '../../contexts/orderContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import Button from '../Button'
import { InputDateE } from '../InputDate'

const ModalScheduleOrder = ({ orderId = null }: { orderId: string | null }) => {
	const { order } = useOrderDetails()
	const [scheduledAt, setScheduledAt] = useState(order.scheduledAt)

	const handleSubmit = async (date: Date | null) => {
		setScheduledAt(date)
		try {
			await ServiceOrders.update(orderId, { scheduledAt: date })
		} catch (e) {
			console.error({ e })
		}
	}

	return (
		<View>
			{scheduledAt ? (
				<View>
					<Button
						onPress={() => handleSubmit(null)}
						icon="close"
						label="Quitar fecha"
						size="xs"
						variant="ghost"
					></Button>
					<InputDateE setValue={handleSubmit} value={scheduledAt} />
				</View>
			) : (
				<Button
					onPress={() => handleSubmit(new Date())}
					icon="calendar"
					variant="ghost"
					label="Programar fecha"
				></Button>
			)}
		</View>
	)
}
export default ModalScheduleOrder
