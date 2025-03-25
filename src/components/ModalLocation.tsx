import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Button from './Button'
import CoordsType from '../types/CoordsType'
import InputMapLocation from './InputMapLocation'
import Loading from './Loading'

const ModalLocation = (props?: ModalLocationProps) => {
  const defaultCoords = props?.coords
  const disabled = props?.disabled
  const setCoords = props?.setCoords
  const modal = useModal({ title: 'Ubicación' })

  if (!defaultCoords) return <Loading />

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
        <InputMapLocation
          defaultCoords={defaultCoords as CoordsType}
          setCoords={setCoords}
        />
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
