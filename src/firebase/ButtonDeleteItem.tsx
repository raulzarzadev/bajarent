import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonConfirm from '../components/ButtonConfirm'
import { onDeleteItem } from './actions/item-actions'
import { useStore } from '../contexts/storeContext'
import { useEmployee } from '../contexts/employeeContext'

const ButtonDeleteItem = ({ itemId }) => {
  const { storeId } = useStore()
  const {
    permissions: { canDeleteItems }
  } = useEmployee()
  const handleDelete = async () => {
    await onDeleteItem({ itemId, storeId })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <ButtonConfirm
      openDisabled={!canDeleteItems}
      text="¿Estas seguro de eliminar este item?"
      handleConfirm={async () => {
        return handleDelete()
      }}
      openVariant="ghost"
      justIcon
      openColor="error"
      icon="delete"
      confirmColor="error"
      confirmLabel="Eliminar"
    />
  )
}

export default ButtonDeleteItem

const styles = StyleSheet.create({})
