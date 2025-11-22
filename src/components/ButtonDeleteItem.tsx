import { StyleSheet, Text, View } from 'react-native'
import ButtonConfirm from './ButtonConfirm'
import { onDeleteItem } from '../firebase/actions/item-actions'
import { useEmployee } from '../contexts/employeeContext'
import { useAuth } from '../contexts/authContext'

const ButtonDeleteItem = ({
  itemId,
  onDeleted,
  disabled
}: {
  itemId: string
  onDeleted?: () => void
  disabled?: boolean
}) => {
  const { storeId } = useAuth()
  const {
    permissions: { canDeleteItems }
  } = useEmployee()
  const handleDelete = async () => {
    await onDeleteItem({ itemId, storeId })
      .then(console.log)
      .catch(console.error)
      .finally(onDeleted)
  }
  return (
    <ButtonConfirm
      openDisabled={!canDeleteItems || disabled}
      text="¿Estas seguro de eliminar este item?"
      handleConfirm={async () => {
        return handleDelete()
      }}
      openVariant="outline"
      //justIcon
      openColor="error"
      icon="delete"
      confirmColor="error"
      confirmLabel="Eliminar"
    />
  )
}

export default ButtonDeleteItem

const styles = StyleSheet.create({})
