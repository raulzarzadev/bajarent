import { View } from 'react-native'
import useModal from '../hooks/useModal'
import type CoordsType from '../types/CoordsType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import InputMapLocation from './InputMapLocation'
import StyledModal from './StyledModal'

const ModalLocation = (props?: ModalLocationProps) => {
	const defaultCoords = props?.coords
	const disabled = props?.disabled
	const setCoords = props?.setCoords
	const modal = useModal({ title: 'Ubicación' })

	return (
		<View>
			<Button
				disabled={disabled}
				justIcon
				icon="map"
				onPress={modal.toggleOpen}
				variant="ghost"
			></Button>
			<StyledModal {...modal} size="full">
				<InputMapLocation defaultCoords={defaultCoords as CoordsType} setCoords={setCoords} />
			</StyledModal>
		</View>
	)
}
export default ModalLocation
export type ModalLocationProps = {
	disabled?: boolean
	coords?: CoordsType
	setCoords?: (location: CoordsType) => Promise<void> | void
}
export const ModalLocationE = (props: ModalLocationProps) => (
	<ErrorBoundary componentName="ModalLocation">
		<ModalLocation {...props} />
	</ErrorBoundary>
)
