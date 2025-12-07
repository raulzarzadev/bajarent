import { Text, View } from 'react-native'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'

import { ViewCurrentWorkE } from './ViewCurrentWork'

const ModalCurrentWork = (props?: ModalCurrentWorkProps) => {
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
export type ModalCurrentWorkProps = {}
export const ModalCurrentWorkE = (props: ModalCurrentWorkProps) => (
	<ErrorBoundary componentName="ModalCurrentWork">
		<ModalCurrentWork {...props} />
	</ErrorBoundary>
)
