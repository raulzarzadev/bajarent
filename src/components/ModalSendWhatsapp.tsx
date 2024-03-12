import { View, Text, Linking } from 'react-native'
import React from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'

export default function ModalSendWhatsapp({ message }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  return (
    <View>
      <Button label="Enviar Whatsapp" onPress={modal.toggleOpen}></Button>
      <StyledModal {...modal}>
        <Text>{message}</Text>
        <Button
          label="Enviar"
          onPress={() => {
            Linking.openURL(
              `whatsapp://send?text=${encodeURIComponent(message)}`
            )
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}
