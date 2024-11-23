import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './InputRadios'
import { gStyles } from '../styles'
import { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { useOrdersCtx } from '../contexts/ordersContext'
import OrderType, {
  ContactType,
  order_status,
  order_type
} from '../types/OrderType'
import { expiredMessage } from '../libs/whatsappMessages'
import { useStore } from '../contexts/storeContext'
import mapEnumToOptions from '../libs/mapEnumToOptions'
import TestMessage from './WhatsappBot/TestMessage'
import { useEmployee } from '../contexts/employeeContext'
import List from './List'
import sendOrderMessage from '../libs/whatsapp/sendOrderMessage'
import { useAuth } from '../contexts/authContext'
import TextInfo from './TextInfo'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import chooseOrderPhone from '../libs/whatsapp/chooseOrderPhone'

export default function ScreenMessages() {
  const { permissions } = useEmployee()
  const { user } = useAuth()
  const userId = user?.id
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
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
      const selectedOrders = orders?.filter(
        (order) =>
          order.status === order_status.DELIVERED &&
          (order.expiresTomorrow || order.expiresOnMonday)
      )
      setSelectedOrders(selectedOrders)
      setMessage(expiredMessage({ order: selectedOrders?.[0], store }))
    }
  }

  const handleSendWhatsappToOrders = async ({
    orders,
    message,
    userId
  }: {
    orders: any[]
    message: string
    userId: string
  }) => {
    setSending(true)
    const TIME_OUT_SECONDS = 5
    const TIME_BETWEEN_MESSAGES = 1000 * TIME_OUT_SECONDS //<--- IN SECONDS
    setProgress(0)
    const sendMessages = orders.map((order: OrderType, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          const phone = chooseOrderPhone(order)
          console.log('enviando mensaje a ', phone)

          await sendOrderMessage({
            phone: phone,
            message: expiredMessage({ order, store }),
            apiKey: store?.chatbot?.apiKey,
            botId: store?.chatbot?.id,
            orderId: order?.id,
            userId
          })
          setProgress(((i + 1) / orders.length) * 100)
          resolve()
        }, i * TIME_BETWEEN_MESSAGES)
      })
    })

    await Promise.all(sendMessages)
    setSending(false)
  }

  if (!(permissions?.isAdmin || permissions?.store?.canSendMessages))
    return (
      <Text style={gStyles.h2}>No tienes permisos para enviar mensajes</Text>
    )
  if (!store.chatbot.enabled)
    return (
      <View>
        <Text style={gStyles.h2}>El chatbot no esta habilitado</Text>
        <Text style={[gStyles.helper, { textAlign: 'center' }]}>
          Habilitalo en la configuración de la tienda y agrega los datos
          necesarios para poder enviar mensajes de forma autamatica
        </Text>
      </View>
    )
  if (sending)
    return (
      <View>
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 12 }]}
        >
          Enviando mensajes...
        </Text>
        <Text style={{ textAlign: 'center', marginVertical: 12 }}>
          {progress.toFixed(0)}%
        </Text>
        <Text style={{ textAlign: 'center', marginVertical: 12 }}>
          No recarges la pagina hasta que haya terminado.{' '}
        </Text>
      </View>
    )
  return (
    <ScrollView>
      <TestMessage />

      <Text style={gStyles.h2}>1. Selecciona tipo de mensajes</Text>
      <InputRadios
        layout="row"
        value={messageType}
        setValue={(val) => setMessageType(val)}
        options={messageTypes}
      />
      <Text style={gStyles.h2}>
        2. Selecciona las ordenes que recibiran este mensaje
      </Text>
      <InputRadios
        layout="row"
        value={target}
        setValue={(val) => {
          setTarget(val)
          handleSelectOrder(val)
        }}
        options={targets}
      />

      {selectedOrders.length === 0 && (
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 12 }]}
        >
          No hay ordenes seleccionadas
        </Text>
      )}
      {selectedOrders.length > 0 && (
        <>
          <TextInfo
            defaultVisible
            text="Click para eliminar una orden de la lista "
            type="info"
          />
          <List
            data={selectedOrders}
            ComponentRow={({ item }: { item: OrderType }) => (
              <Text>
                {item?.folio} - {item?.fullName}{' '}
                {item?.sentMessages?.some((m) => isToday(asDate(m?.sentAt))) &&
                  '✅'}
              </Text>
            )}
            onPressRow={(orderId) => {
              const clearOrders = selectedOrders.filter(
                (order) => order.id !== orderId
              )
              setSelectedOrders(clearOrders)
            }}
            filters={[]}
            rowsPerPage={30}
          />
        </>
      )}

      <View style={{ marginVertical: 8, maxWidth: 120, margin: 'auto' }}>
        <ButtonConfirm
          progress={progress}
          openColor="success"
          icon="whatsapp"
          openDisabled={
            sending ||
            !selectedOrders?.length ||
            !messageType ||
            !target ||
            !message ||
            !store?.chatbot?.apiKey ||
            !store?.chatbot?.id
          }
          confirmDisabled={
            !selectedOrders?.length ||
            !messageType ||
            !target ||
            !message ||
            !store?.chatbot?.apiKey ||
            !store?.chatbot?.id
          }
          openLabel="Enviar"
          modalTitle="Enviar mensaje"
          confirmLabel="Enviar mensaje"
          handleConfirm={async () => {
            handleSendWhatsappToOrders({
              orders: selectedOrders,
              message,
              userId
            })
            // console.log('Sending message to:', selectedOrders)
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
    </ScrollView>
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
  soon_expire = 'Por vencer (mañana,o el lunes)'
}
enum MessageTypeEnum {
  expire = 'Vencimiento'
}
type MessageType = keyof typeof MessageTypeEnum
type MessageTarget = keyof typeof MessageTargetEnum
const targets = mapEnumToOptions(MessageTargetEnum)
const messageTypes = mapEnumToOptions(MessageTypeEnum)
