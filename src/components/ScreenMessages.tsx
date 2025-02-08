import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './InputRadios'
import { gStyles } from '../styles'
import { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { useOrdersCtx } from '../contexts/ordersContext'
import OrderType, { order_status } from '../types/OrderType'
import { expiredMessage } from '../libs/whatsappMessages'
import { useStore } from '../contexts/storeContext'
import mapEnumToOptions from '../libs/mapEnumToOptions'
import TestMessage from './WhatsappBot/TestMessage'
import { useEmployee } from '../contexts/employeeContext'
import { onSendOrderWhatsapp } from '../libs/whatsapp/sendOrderMessage'
import { useAuth } from '../contexts/authContext'
import chooseOrderPhone from '../libs/whatsapp/chooseOrderPhone'
import ListOrders from './ListOrders'
import asDate, { endDate } from '../libs/utils-date'
import { isBefore, subDays } from 'date-fns'
import Loading from './Loading'
import { sleep } from '../libs/sleep'
import { set } from 'lodash'
import Button from './Button'

export default function ScreenMessages() {
  const { permissions, employee } = useEmployee()
  const [doneMessage, setDoneMessage] = useState(null)
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
  const [sentList, setSentList] = useState<
    { phone: string; success: boolean; customerName: string }[]
  >([])

  const EXPIRED_DAYS = 5

  const handleSelectOrder = (target: MessageTarget | '') => {
    if (target === 'expired') {
      const selectedOrders = orders?.filter(
        (order) =>
          order.status === order_status.DELIVERED &&
          order.isExpired &&
          // has more tha EXPIRED_DAYS days
          //expire at was 5 days ago
          isBefore(
            endDate(asDate(order.expireAt)),
            subDays(endDate(new Date()), EXPIRED_DAYS)
          )
        //&& !order.expiresToday
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
    let sentList = []
    const TIME_OUT_SECONDS = 5
    const TIME_BETWEEN_MESSAGES = 1000 * TIME_OUT_SECONDS //<--- IN SECONDS
    setProgress(0)
    setSending(true)
    const sendMessages = orders.map((order: OrderType, i) => {
      return new Promise<{
        phone: string
        success: boolean
        customerName: string
      }>((resolve) => {
        setTimeout(async () => {
          const phone = chooseOrderPhone(order)
          console.log('enviando mensaje a ', phone)
          const res = await onSendOrderWhatsapp({
            order,
            store,
            type: 'expire',
            userId
          })
          console.log('res', res)
          const sentMessage = {
            phone,
            success: res?.success,
            customerName: order.fullName
          }
          sentList.push(sentMessage)
          setSentList((prev) => [...prev, sentMessage])

          setProgress(((i + 1) / orders.length) * 100)
          resolve(sentMessage)
        }, i * TIME_BETWEEN_MESSAGES)
      })
    })
    const res = await Promise.all(sendMessages)
    const sentMsjs = sentList?.filter((s) => s.success)?.length || 0
    const TIME_OUT = 10 //* ---> seconds to close modal
    setDoneMessage(`${sentMsjs} de ${orders.length}`)
    console.log({ res })

    await sleep(TIME_OUT)
    setSending(false)
    setDoneMessage(null)
    setSentList([])

    return res
  }

  console.log({
    store,
    permissions,
    canSendMessages: permissions?.store?.canSendMessages,
    employee,
    user
  })
  const canSendMessages =
    permissions?.store?.canSendMessages || permissions?.isAdmin

  if (!employee || store === undefined) return <Loading />

  if (!store?.chatbot?.enabled)
    return (
      <View>
        <Text style={gStyles.h2}>El chatbot no esta habilitado</Text>
        <Text style={[gStyles.helper, { textAlign: 'center' }]}>
          Habilitalo en la configuración de la tienda y agrega los datos
          necesarios para poder enviar mensajes de forma autamatica
        </Text>
      </View>
    )

  if (!canSendMessages) {
    return (
      <Text style={gStyles.h2}>No tienes permisos para enviar mensajes</Text>
    )
  }

  return (
    <ScrollView>
      {permissions?.store?.canSendMessages && <TestMessage />}

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
        options={targets.with(
          targets.findIndex((t) => t.value === 'expired'),
          {
            label: `Vencidas  (+${EXPIRED_DAYS} días)`,
            value: 'expired'
          }
        )}
      />

      {selectedOrders?.length === 0 && (
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 12 }]}
        >
          No hay ordenes seleccionadas
        </Text>
      )}
      {selectedOrders?.length > 0 && (
        <ListOrders
          orders={selectedOrders}
          rowSideButtons={[
            {
              label: 'Eliminar',
              onPress: (rowId) => {
                const clearOrders = selectedOrders.filter(
                  (order) => order.id !== rowId
                )
                setSelectedOrders(clearOrders)
              },
              icon: 'sub',
              color: 'error'
            }
          ]}
        />
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
            const res = await handleSendWhatsappToOrders({
              orders: selectedOrders,
              message,
              userId
            })
            console.log({ res })

            return
          }}
        >
          <Text>
            Mensaje:
            <Text style={{ fontWeight: 'bold' }}>
              {messageTypes.find((v) => v.value === messageType)?.label || ''}
            </Text>
          </Text>
          <Text>
            Objetivo:
            <Text style={{ fontWeight: 'bold' }}>
              {targets.find((v) => v.value === target)?.label || ''}
            </Text>
          </Text>
          <Text style={{ textAlign: 'center' }}>
            <Text> Ordenes: </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {selectedOrders?.length || 0}{' '}
            </Text>
            ordenes seleccionadas
          </Text>

          {sending ? (
            <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
              <View style={{ marginVertical: 12 }}>
                {!doneMessage && (
                  <Text style={gStyles.h3}>Enviando mensajes...</Text>
                )}
              </View>
              {sentList?.map((sent, i) => (
                <View style={{ justifyContent: 'center' }}>
                  <Text key={i}>
                    {sent.customerName} {sent.phone}{' '}
                    {sent.success ? '✅' : '❌'}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <>
              <Text
                style={[
                  gStyles.tBold,
                  {
                    textAlign: 'center',
                    marginVertical: 8,
                    fontStyle: 'italic'
                  }
                ]}
              >
                Ejemplo de mensaje:
              </Text>
              <Text>{message}</Text>
            </>
          )}
          {doneMessage && (
            <>
              <Text style={gStyles.h3}>
                {doneMessage}
                <Text style={gStyles.p}>mensajes enviados</Text>
              </Text>
              <Text style={[gStyles.helper, gStyles.tCenter]}>
                Cerrando ...
              </Text>
            </>
          )}
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
