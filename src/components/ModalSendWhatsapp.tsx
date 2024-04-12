import { View, Text, Linking } from 'react-native'
import React from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import theme from '../theme'

export default function ModalSendWhatsapp({ message = '', to = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const invalidPhone = !to || to?.length < 10
  return (
    <View>
      <Button
        label="Whatsapp"
        onPress={modal.toggleOpen}
        size="small"
        icon="whatsapp"
      ></Button>
      <StyledModal {...modal}>
        <Text>{message}</Text>
        {invalidPhone && (
          <Text
            style={[
              gStyles.helper,
              { color: theme.error, textAlign: 'center', marginVertical: 6 }
            ]}
          >
            Numero de telefono invalido
          </Text>
        )}
        <Button
          disabled={invalidPhone}
          label="Enviar"
          onPress={() => {
            Linking.openURL(
              `whatsapp://send?text=${encodeURIComponent(message)}&phone=${to}`
            )
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}
