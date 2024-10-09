import { View, Text } from 'react-native'
import React from 'react'
import useModal from './hooks/useModal'
import StyledModal from './components/StyledModal'
import Button from './components/Button'
import { useCurrentWorkCtx } from './contexts/currentWorkContext'
import { ServiceCurrentWork } from './firebase/ServiceCurrentWork'
import { useStore } from './contexts/storeContext'

const ModalCloseOperations = () => {
  const modal = useModal({ title: 'Cerrar operación' })
  const { storeId } = useStore()
  const currentWork = useCurrentWorkCtx()
  const handleConfirmCloseOps = async () => {
    //* Create daily progress registry
    //* Restrict access to employees
    try {
      const res = await ServiceCurrentWork.add({ storeId, currentWork })
      console.log({ res })
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <View>
      <Button
        label="Cerrar operación"
        onPress={modal.toggleOpen}
        variant="ghost"
      ></Button>
      <StyledModal {...modal}>
        <Button
          onPress={handleConfirmCloseOps}
          label="Confirmar "
          variant="outline"
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalCloseOperations
