import { View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { useStore } from '../../contexts/storeContext'
import type { ReturnModal } from '../../hooks/useModal'
import { onRentFinish } from '../../libs/order-actions'
import { onSendOrderWhatsapp } from '../../libs/whatsapp/sendOrderMessage'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { gSpace } from '../../styles'
import Button from '../Button'
import CardItem from '../CardItem'
import StyledModal from '../StyledModal'
import TextInfo from '../TextInfo'

const ModalRentFinish = ({ modal }: { modal: ReturnModal }) => {
	const { order } = useOrderDetails()
	const { user } = useAuth()
	const { store } = useStore()
	const { addWork } = useCurrentWork()
	const { data: customers } = useCustomers()
	const items = order?.items || []
	const handleRentFinish = async () => {
		//*pickup items

		modal.setOpen(false)
		addWork({
			work: {
				type: 'order',
				action: 'rent_picked_up',
				details: {
					orderId: order.id,
					sectionId: order?.assignToSection || null
				}
			}
		})
		onRentFinish({ order, userId: user.id })
		onSendOrderWhatsapp({
			store,
			order,
			type: 'sendPickedUp',
			userId: user.id,
			customer: customers.find(customer => customer.id === order.customerId)
		})
	}

	return (
		<View>
			<StyledModal {...modal}>
				<View>
					<TextInfo defaultVisible text="Asegurate de que RECOGES el siguiente artículo" />
				</View>
				<View style={{ marginVertical: gSpace(3) }}>
					{items?.map(item => (
						<CardItem item={item} key={item.id} />
					))}
				</View>
				<Button
					label="Recoger"
					onPress={() => {
						handleRentFinish()
					}}
				></Button>
			</StyledModal>
		</View>
	)
}

export default ModalRentFinish
