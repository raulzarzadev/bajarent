import { View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { useStore } from '../../contexts/storeContext'
import type { ReturnModal } from '../../hooks/useModal'
import StyledModal from '../StyledModal'

const ModalDeliverySale = ({ modal }: { modal: ReturnModal }) => {
	const { store } = useStore()
	const { order } = useOrderDetails()
	const { user } = useAuth()

	return (
		<View>
			<StyledModal {...modal}></StyledModal>
		</View>
	)
}

export default ModalDeliverySale
