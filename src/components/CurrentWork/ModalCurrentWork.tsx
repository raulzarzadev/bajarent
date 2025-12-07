import { View } from 'react-native'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'

import { ViewCurrentWorkE } from './ViewCurrentWork'

const ModalCurrentWork = () => {
	const modal = useModal({ title: 'Trabajo actual' })

	return (
		<View>
			<Button justIcon icon="folderCheck" onPress={modal.toggleOpen} variant="ghost" />
			<StyledModal {...modal}>
				{/* ********************** Switch between work type */}
				<ViewCurrentWorkE />
			</StyledModal>
		</View>
	)
}
export default ModalCurrentWork
export const ModalCurrentWorkE = () => (
	<ErrorBoundary componentName="ModalCurrentWork">
		<ModalCurrentWork />
	</ErrorBoundary>
)
