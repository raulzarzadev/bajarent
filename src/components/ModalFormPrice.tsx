import { StyleSheet, View } from 'react-native'
import React from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import FormPrice from './FormPrice'

const ModalFormPrice = ({ handleSubmit }) => {
  const modal = useModal({ title: 'Agregar precio' })
  return (
    <View>
      <Button icon="add" justIcon onPress={modal.toggleOpen}></Button>
      <StyledModal {...modal}>
        <FormPrice
          handleSubmit={(price) => {
            modal.toggleOpen()
            return handleSubmit(price)
          }}
        />
      </StyledModal>
    </View>
  )
}

export default ModalFormPrice

const styles = StyleSheet.create({})
