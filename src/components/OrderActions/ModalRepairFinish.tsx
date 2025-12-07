import { View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import type { ReturnModal } from '../../hooks/useModal'
import { onRepairFinish } from '../../libs/order-actions'
import Button from '../Button'
import StyledModal from '../StyledModal'

const ModalRepairFinish = ({ modal }: { modal: ReturnModal }) => {
	const { order } = useOrderDetails()

	const { user, storeId } = useAuth()

	const handleStartRepair = async () => {
		//*pickup items
		modal.setOpen(false)

		await onRepairFinish({
			orderId: order.id,
			userId: user.id,
			storeId: storeId
		})
	}

	return (
		<View>
			<StyledModal {...modal}>
				<Button
					label="Reparación terminada 🔧"
					onPress={() => {
						handleStartRepair()
					}}
				></Button>
			</StyledModal>
		</View>
	)
}

export default ModalRepairFinish
