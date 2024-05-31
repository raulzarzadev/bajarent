import { View, Text, Linking } from 'react-native'
import React, { useState } from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import theme from '../theme'
import OrderType, { order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import asDate, { dateFormat } from '../libs/utils-date'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { useStore } from '../contexts/storeContext'
import InputRadios from './InputRadios'
import { translateTime } from '../libs/expireDate'
export default function ModalSendWhatsapp({ orderId = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const [order, setOrder] = useState<OrderType>()
  const phone = order?.phone
  const invalidPhone = !phone || phone?.length < 10
  const { store } = useStore()
  const item = order?.items?.[0]
  //*********  MEMES
  const WELCOME = `Estimado ${order?.fullName} cliente de ${store?.name}`
  const ORDER_TYPE = `Su contrato📄 de ${
    dictionary(order?.type)?.toUpperCase() || ''
  } ${item?.categoryName ? `de ${item?.categoryName}` : ''}: *${order?.folio}* `
  const BANK_INFO = `Favor de transferir 💸  únicamente a cualquiera de las siguientes cuentas a nombre de ${
    store?.name
  } y/o Humberto Avila:
  \n${store?.bankInfo
    .map(({ bank, clabe }) => {
      return `🏦 ${bank} ${clabe}\n`
    })
    .join('')} \n🏦 SPIN/OXXO 4217470038523789 
`
  const CONTACTS = `Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:
📞 ${store?.phone}
📱 ${store?.mobile} Whatsapp `

  const AGRADECIMIENTOS = `De antemano le agradecemos su atención 🙏🏼`

  const RENT_PERIOD = `Periodo contratado: ${
    translateTime(order?.items?.[0]?.priceSelected?.time) || ''
  }
  
  ⏳ Inicio: ${orderStringDates(order).deliveredAt}
  🔚 Vencimiento: ${orderStringDates(order).expireAt}`

  const PRICE = `💲${order?.items?.[0]?.priceSelected?.amount?.toFixed(2) || 0}`
  const PAYMENTS = `Pagos: ${orderPayments({ order })}`
  //******** MESSAGES
  const RENT_EXPIRE_SOON = `${WELCOME}
  \n${ORDER_TYPE}  vence el día de mañana 😔.
  \n*Para renovar*
  \n${BANK_INFO}
  \nEnviar su comprobante al Whatsapp y esperar confirmación 👌🏼
  \n${CONTACTS}
  \nEn caso de no querer continuar con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
  \n${AGRADECIMIENTOS}
  `
  const RENT_EXPIRE_TODAY = `${WELCOME}
  \n${ORDER_TYPE}   *VENCE HOY* 😔. 
  \n*Para renovar*
  \n${BANK_INFO}
  \nEnviar su comprobante al Whatsapp y esperar confirmación 👌🏼
  \nEn caso de no querer continuar con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
  \n${CONTACTS}
  \n${AGRADECIMIENTOS}
  `

  const RENT_RECEIPT = `${WELCOME}
  \n${ORDER_TYPE}
  \n${RENT_PERIOD}
  \n${PAYMENTS}
  \n${CONTACTS}
  📍 ${store?.address || ''}`

  const REPAIR_RECEIPT = `
  ${WELCOME}
  ${ORDER_TYPE}
  📆Fecha ${
    order?.pickedUpAt
      ? dateFormat(asDate(order?.pickedUpAt), 'dd MMMM yyyy')
      : ''
  }
  🔧 *Información del aparato*
  🛠️ Marca: ${order?.itemBrand || ''}
  #️⃣ Serie: ${order?.itemSerial || ''} 
  🧾 Falla: ${order?.description || ''}
  💲 Cotización:  $${order?.repairTotal || 0}
  🗓️ Garantía 1 Mes
  ${PAYMENTS}
  ${CONTACTS}
  📍 ${store?.address || ''}`

  const messages = [
    {
      type: 'upcomingExpire',
      content: RENT_EXPIRE_SOON
    },
    {
      type: 'expireToday',
      content: RENT_EXPIRE_TODAY
    },
    {
      type: 'receipt-rent',
      content: RENT_RECEIPT
    },
    {
      type: 'receipt-repair',
      content: REPAIR_RECEIPT
    }
  ]

  const handleGetOrderInfo = () => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
      setMessage(messages.find((m) => m.type === messageType)?.content)
    })
  }
  const [messageType, setMessageType] = useState<
    'upcomingExpire' | 'expireToday' | 'receipt-rent' | 'receipt-repair'
  >()
  const [message, setMessage] = useState<string>()
  // messages.find((m) => m.type === messageType)?.content
  let options = []
  if (order?.type === order_type.RENT) {
    options = [
      { label: 'Vence mañana', value: 'upcomingExpire' },
      { label: 'Vence hoy', value: 'expireToday' },
      { label: 'Recibo', value: 'receipt-rent' }
    ]
  }
  if (order?.type === order_type.REPAIR) {
    options = [{ label: 'Recibo', value: 'receipt-repair' }]
  }

  return (
    <View>
      <Button
        label="Whatsapp"
        onPress={() => {
          handleGetOrderInfo()
          modal.toggleOpen()
        }}
        size="small"
        icon="whatsapp"
      ></Button>
      <StyledModal {...modal}>
        <InputRadios
          options={options}
          value={messageType}
          setValue={(value) => {
            setMessageType(value)
            setMessage(messages.find((m) => m.type === value)?.content || '')
          }}
          layout="row"
        />
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
          disabled={invalidPhone || !message}
          label="Enviar"
          onPress={() => {
            Linking.openURL(
              `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
            )
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}
const orderStringDates = (order, format = 'EEEE dd MMMM yy') => {
  return {
    expireAt: dateFormat(asDate(order?.expireAt), format) || '',
    deliveredAt: dateFormat(asDate(order?.deliveredAt), format) || ''
  }
}
const orderPeriod = (order: Partial<OrderType>): string => {
  const res = ''
  //* if is rent should return the period
  if (
    order?.type === order_type.RENT ||
    order?.type === order_type.STORE_RENT
  ) {
    return `Periodo:  ${dateFormat(
      asDate(order.deliveredAt),
      'dd/MM/yy'
    )} al ${dateFormat(asDate(order.expireAt), 'dd/MM/yy')}`
  }

  if (order?.type === order_type.REPAIR) {
    return `Marca: ${order?.itemBrand || ''}\nSerie: ${
      order?.itemSerial || ''
    }\nProblema: ${order?.description || ''}
  \n${
    order?.repairInfo
      ? `\n${order?.repairInfo || ''}
      \n$${order?.repairTotal || 0}`
      : ''
  }`
  }
  return res
}
const orderPayments = ({ order }: { order: OrderType }) => {
  let res = ''
  if (order?.payments?.length > 0) {
    res += `
  *Pagos:* \n`
    order.payments.forEach((p) => {
      res += `${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(p.amount)} ${dictionary(p.method)} ${dateFormat(
        asDate(p.createdAt),
        'dd/MMM/yy HH:mm'
      )} \n`
    })
  }
  return res
}
