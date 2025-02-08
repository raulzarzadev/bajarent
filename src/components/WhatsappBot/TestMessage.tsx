import { View, Text } from 'react-native'
import ButtonConfirm from '../ButtonConfirm'
import { useState } from 'react'
import InputPhone from '../InputPhone'
import sendMessage from '../../libs/whatsapp/sendMessage'
import { useStore } from '../../contexts/storeContext'

const TestMessage = () => {
  const [number, setNumber] = useState('')
  const { store } = useStore()

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        width: 140,
        marginLeft: 'auto',
        marginVertical: 8
      }}
    >
      <ButtonConfirm
        openSize="xs"
        openLabel="Mensaje de prueba"
        openVariant="ghost"
        icon="comment"
        handleConfirm={async () => {
          sendMessage({
            phone: number,
            message: 'Mensaje de prueba',
            apiKey: store?.chatbot?.apiKey,
            botId: store?.chatbot?.id
          })
        }}
        confirmLabel="Enviar"
      >
        <View style={{ marginVertical: 8 }}>
          <InputPhone onChange={(number) => setNumber(number)} />
        </View>
      </ButtonConfirm>
    </View>
  )
}
export default TestMessage
