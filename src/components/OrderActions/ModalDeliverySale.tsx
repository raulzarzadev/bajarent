import { View } from 'react-native'
import type { ReturnModal } from '../../hooks/useModal'
import StyledModal from '../StyledModal'

const ModalDeliverySale = ({ modal }: { modal: ReturnModal }) => {
	return (
		<View>
			<StyledModal {...modal}></StyledModal>
		</View>
	)
}

export default ModalDeliverySale
