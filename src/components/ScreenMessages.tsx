import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './InputRadios'
import { gStyles } from '../styles'
import { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { useOrdersCtx } from '../contexts/ordersContext'
import { order_status, order_type } from '../types/OrderType'
import { expiredMessage } from '../libs/whatsappMessages'
import { useStore } from '../contexts/storeContext'
import mapEnumToOptions from '../libs/mapEnumToOptions'
import sendMessage from '../libs/whatsapp/sendMessage'
import Button from './Button'

export default function ScreenMessages() {
  const [messageType, setMessageType] = useState<MessageType>(undefined)
  const [target, setTarget] = useState<MessageTarget>(undefined)
  const { orders = [] } = useOrdersCtx()
  const { store } = useStore()
  const [selectedOrders, setSelectedOrders] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const handleSelectOrder = (target: MessageTarget | '') => {
    if (target === 'expired') {
      const selectedOrders = orders?.filter(
        (order) => order.status === order_status.DELIVERED && order.isExpired
      )
      setSelectedOrders(selectedOrders)
      setMessage(expiredMessage({ order: selectedOrders?.[0], store }))
    }
    if (target === 'soon_expire') {
      console.log({ orders })
      const selectedOrders = orders?.filter(
        (order) =>
          order.status === order_status.DELIVERED &&
          (order.expiresToday || order.expiresTomorrow || order.expiresOnMonday)
      )
      setSelectedOrders(selectedOrders)
      setMessage(expiredMessage({ order: selectedOrders?.[0], store }))
    }
  }

  const handleSendWhatsappToOrders = async ({
    orders,
    message
  }: {
    orders: any[]
    message: string
  }) => {
    orders.map(async (order) => {
      sendMessage({
        phone: order?.phone,
        message: message
      })
    })
  }

  return (
    <View>
      <Text style={gStyles.h2}>Mensaje</Text>
      <Button
        label="Send"
        onPress={() => {
          sendMessage({
            phone: '525543374016',
            message: 'adios',
            apiKey: store.chatbot.apiKey,
            botId: store.chatbot.id
          })
        }}
      ></Button>
      <InputRadios
        layout="row"
        value={messageType}
        setValue={(val) => setMessageType(val)}
        options={messageTypes}
      />
      <Text style={gStyles.h2}>Ordenes</Text>
      <InputRadios
        layout="row"
        value={target}
        setValue={(val) => {
          setTarget(val)
          handleSelectOrder(val)
        }}
        options={targets}
      />
      <ButtonConfirm
        openLabel="Enviar"
        modalTitle="Enviar mensaje"
        handleConfirm={async () => {
          handleSendWhatsappToOrders({
            orders: selectedOrders,
            message
          })
          console.log('Sending message to:', selectedOrders)
        }}
      >
        <Text>
          Mensaje:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {messageTypes.find((v) => v.value === messageType)?.label || ''}
          </Text>
        </Text>
        <Text>
          Objetivo:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {targets.find((v) => v.value === target)?.label || ''}
          </Text>
        </Text>

        <Text style={{ textAlign: 'center' }}>
          <Text> Ordenes: </Text>
          <Text style={{ fontWeight: 'bold' }}>
            {selectedOrders?.length || 0}
          </Text>{' '}
          ordenes seleccionadas
        </Text>
        <Text
          style={[
            gStyles.tBold,
            { textAlign: 'center', marginVertical: 8, fontStyle: 'italic' }
          ]}
        >
          Ejemplo de mensaje:{' '}
        </Text>
        <Text>{message}</Text>
      </ButtonConfirm>
    </View>
  )
}
export type ScreenMessagesProps = {}
export const ScreenMessagesE = (props: ScreenMessagesProps) => (
  <ErrorBoundary componentName="ScreenMessages">
    <ScreenMessages {...props} />
  </ErrorBoundary>
)

enum MessageTargetEnum {
  expired = 'Vencidas',
  soon_expire = 'Por vencer'
}
enum MessageTypeEnum {
  expire = 'Vencimiento'
}
type MessageType = keyof typeof MessageTypeEnum
type MessageTarget = keyof typeof MessageTargetEnum
const targets = mapEnumToOptions(MessageTargetEnum)
const messageTypes = mapEnumToOptions(MessageTypeEnum)
