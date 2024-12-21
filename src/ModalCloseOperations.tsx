import { View, Text } from 'react-native'
import React from 'react'
import useModal from './hooks/useModal'
import StyledModal from './components/StyledModal'
import Button from './components/Button'
import { useStore } from './contexts/storeContext'
import { onDownloadBackup } from './libs/downloadOrders'
import Loading from './components/Loading'

const ModalCloseOperations = () => {
  const modal = useModal({ title: 'Cerrar operación' })
  const { storeId, staff, store } = useStore()
  const [loading, setLoading] = React.useState(false)
  const handleConfirmCloseOps = async () => {
    setLoading(true)

    await onDownloadBackup({
      storeId,
      storeName: store?.name || '',
      storeStaff: staff
    })
      .then(() => {
        setLoading(false)
      })
      .catch((res) => console.log(res))
    modal.toggleOpen()
  }

  return (
    <View>
      <Button
        label="Respaldo"
        icon="backup"
        onPress={modal.toggleOpen}
        variant="ghost"
        size="xs"
        disabled={loading}
      ></Button>
      <StyledModal {...modal}>
        {loading && (
          <>
            <Text>Generando archivos</Text>
            <Text>No cerrar ni recargar esta página</Text>
            <Loading />
          </>
        )}
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
