import { View, Text } from 'react-native'
import React from 'react'
import useModal from './hooks/useModal'
import StyledModal from './components/StyledModal'
import Button from './components/Button'
import { useCurrentWorkCtx } from './contexts/currentWorkContext'
//import { ServiceCurrentWork } from './firebase/ServiceCurrentWork'
import { useStore } from './contexts/storeContext'
import { onDownloadBackup, onDownloadRents } from './libs/downloadOrders'
import { ServiceBalances } from './firebase/ServiceBalances2'

const ModalCloseOperations = () => {
  const modal = useModal({ title: 'Cerrar operación' })
  const { storeId, staff } = useStore()
  const { currentWork } = useCurrentWorkCtx()
  const [loading, setLoading] = React.useState(false)
  console.log({ currentWork })
  const handleConfirmCloseOps = async () => {
    //* Create daily progress registry
    //* Restrict access to employees
    setLoading(true)

    onDownloadBackup({
      storeId,
      storeStaff: staff
    }).then(() => {
      setLoading(false)
      modal.toggleOpen()
    })
  }

  return (
    <View>
      <Button
        label="Cerrar operación"
        onPress={modal.toggleOpen}
        variant="ghost"
        disabled={loading}
      ></Button>
      <StyledModal {...modal}>
        <Button
          onPress={handleConfirmCloseOps}
          label="Confirmar "
          variant="outline"
          disabled={loading}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalCloseOperations
