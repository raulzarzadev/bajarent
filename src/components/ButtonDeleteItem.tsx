import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonConfirm from './ButtonConfirm'
import { onDeleteItem } from '../firebase/actions/item-actions'
import { useStore } from '../contexts/storeContext'
import { useEmployee } from '../contexts/employeeContext'

const ButtonDeleteItem = ({
  itemId,
  onDeleted,
  disabled
}: {
  itemId: string
  onDeleted?: () => void
  disabled?: boolean
}) => {
  const { storeId } = useStore()
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
