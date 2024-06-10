import { View, Text, Linking } from 'react-native'
import React, { useState } from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import theme from '../theme'
import OrderType, { order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import asDate, {
  dateFormat,
  fromNow,
  isAfterTomorrow,
  isBeforeYesterday
} from '../libs/utils-date'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { useStore } from '../contexts/storeContext'
import InputRadios from './InputRadios'
import { translateTime } from '../libs/expireDate'
import SpanCopy from './SpanCopy'
import { isToday, isTomorrow } from 'date-fns'
export default function ModalSendWhatsapp({ orderId = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const [order, setOrder] = useState<OrderType>()
  const phone = order?.phone
  const invalidPhone = !phone || phone?.length < 10
  const { store } = useStore()
  const item = order?.items?.[0]
  //*********  MEMES
  const WELCOME = `Estimado ${order?.fullName} cliente de ${store?.name}`
  const ORDER_TYPE = `Su servicio📄 de ${
    dictionary(order?.type)?.toUpperCase() || ''
  } ${item?.categoryName ? `de ${item?.categoryName}` : ''}: *${order?.folio}* `
  const BANK_INFO = `Favor de transferir 💸  únicamente a cualquiera de las siguientes cuentas a nombre de ${
    store?.name
  } y/o ${store?.accountHolder || ''}:
  \n${store?.bankInfo
    .map(({ bank, clabe }) => {
      if (!bank) return ''
      return `🏦 ${bank} ${clabe}\n`
    })
    .join('')}`

  const PHONES = `📞 ${store?.phone}
📱 ${store?.mobile} Whatsapp`

  const CONTACTS = `Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:\n${PHONES}
`

  const AGRADECIMIENTOS = `De antemano le agradecemos su atención 🙏🏼`

  const RENT_PERIOD = `Periodo contratado: ${
    translateTime(order?.items?.[0]?.priceSelected?.time) || ''
  }
  
  ⏳ Inicio: ${orderStringDates(order).deliveredAt}
  🔚 Vencimiento: ${orderStringDates(order).expireAt}`

  const PRICE = `💲${order?.items?.[0]?.priceSelected?.amount?.toFixed(2) || 0}`
  const PAYMENTS = ` ${orderPayments({ order })}`
  const ADDRESS = `📍${store?.address ? `Dirección: ${store.address}` : ''}`
  //******** MESSAGES

  const expireDateString = (order) => {
    const date = asDate(order?.expireAt)

    if (isToday(date)) {
      return '*VENCE HOY* 😔.'
    }
    if (isTomorrow(date)) {
      return '*VENCE MAÑANA* 😔.'
    }
    if (isAfterTomorrow(date)) {
      return `VENCE EL ${dateFormat(date, 'EEEE dd MMMM yy')} (${fromNow(
        date
      )})`
    }
    if (isBeforeYesterday(date)) {
      return `VENCIÓ el ${dateFormat(date, 'EEEE dd MMMM yy')} (${fromNow(
        date
      )})`
    }
    return ''
  }

  const RENT_EXPIRE_DATE = `${WELCOME}
  \n${ORDER_TYPE}  ${expireDateString(order)}.
  \n*Para renovar*
  \n${BANK_INFO}
  \nEnviar su comprobante al Whatsapp  ${store.mobile} y esperar confirmación 👌🏼
  \nEn caso de *NO CONTINUAR* con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}
  `

  const RENT_RECEIPT = `${WELCOME}
  \n${ORDER_TYPE}
  \n${RENT_PERIOD}
  \n${PAYMENTS}
  \n${CONTACTS}
  \n${ADDRESS}`

  const REPAIR_RECEIPT = `
  \n${WELCOME}
  \n${ORDER_TYPE}
  \n📆Fecha ${
    order?.pickedUpAt
      ? dateFormat(asDate(order?.pickedUpAt), 'dd MMMM yyyy')
      : ''
  }
  \n🔧 *Información del aparato*
  🛠️ Marca: ${order?.itemBrand || ''}
  #️⃣ Serie: ${order?.itemSerial || ''} 
  🧾 Falla: ${order?.repairInfo || ''}
  💲 Cotización:  $${order?.repairTotal || 0}
  🗓️ Garantía 1 Mes
  
  \n${PAYMENTS}
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}`

  type MessageType =
    | 'expireAt'
    | 'receipt-rent'
    | 'receipt-repair'
    | 'not-found'
    | 'repair-picked-up'
    | 'rent-quality-survey'

  const CLIENT_NOT_FOUND = `${WELCOME}
  \nNo pudimos ponernos en contacto con usted para atender ${ORDER_TYPE}
  \nResponde este mensaje o póngase en contacto a lo teléfonos :
  \n${PHONES}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}
  `

  const REPAIR_PICKED_UP = `
  \n${WELCOME}
  \n${ORDER_TYPE}
  \n📆Fecha ${
    order?.pickedUpAt
      ? dateFormat(asDate(order?.pickedUpAt), 'dd MMMM yyyy')
      : ''
  }
  \n🔧 *Información del aparato*
  🛠️ Marca: ${order?.itemBrand || ''}
  #️⃣ Serie: ${order?.itemSerial || ''} 
  🧾 Falla: ${order?.repairInfo || ''}
  💲 Cotización:  $${order?.repairTotal || 0}
  
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}`

  const QUALITY_SURVEY = `${WELCOME}
  \nAyudanos a mejorar el servicio con esta breve encuesta.
  \nhttps://forms.gle/1kBa9yeZyP9rc6YeA
  \n${AGRADECIMIENTOS}
  \n${CONTACTS}
  `

  const messages: { type: MessageType; content: string }[] = [
    // {
    //   type: 'upcomingExpire',
    //   content: RENT_EXPIRE_SOON
    // },
    // {
    //   type: 'expireToday',
    //   content: RENT_EXPIRE_TODAY
    // },
    {
      type: 'not-found',
      content: CLIENT_NOT_FOUND
    },
    {
      type: 'receipt-rent',
      content: RENT_RECEIPT
    },
    {
      type: 'receipt-repair',
      content: REPAIR_RECEIPT
    },
    {
      type: 'expireAt',
      content: RENT_EXPIRE_DATE
    },
    {
      type: 'repair-picked-up',
      content: REPAIR_PICKED_UP
    },
    {
      type: 'rent-quality-survey',
      content: QUALITY_SURVEY
    }
  ]

  const handleGetOrderInfo = () => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
      setMessage(messages.find((m) => m.type === messageType)?.content)
    })
  }
  const [messageType, setMessageType] = useState<MessageType>()
  const [message, setMessage] = useState<string>()
  // messages.find((m) => m.type === messageType)?.content
  let options = []
  if (order?.type === order_type.RENT) {
    options = [
      { label: 'Vencimiento', value: 'expireAt' },
      { label: 'Recibo', value: 'receipt-rent' },
      { label: 'No encontrado', value: 'not-found' },
      { label: 'Encuesta', value: 'rent-quality-survey' }
    ]
  }
  if (order?.type === order_type.REPAIR) {
    options = [
      { label: 'Recibo', value: 'receipt-repair' },
      { label: 'No encontrado', value: 'not-found' },
      { label: 'Recogido', value: 'repair-picked-up' }
    ]
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
        {message && <SpanCopy label={'Copiar'} copyValue={message} />}
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
const orderStringDates = (
  order: Partial<OrderType>,
  format = 'EEEE dd MMMM yy'
) => {
  if (order?.extensions) {
    const lastExtension = Object.values(order?.extensions || {})?.sort(
      (a, b) => {
        return asDate(a.startAt).getTime() > asDate(b.expireAt).getTime()
          ? 1
          : -1
      }
    )[0]
    console.log({ lastExtension })
    return {
      expireAt: dateFormat(asDate(lastExtension?.expireAt), format) || '',
      deliveredAt: dateFormat(asDate(lastExtension?.startAt), format) || ''
    }
  }
  return {
    expireAt: dateFormat(asDate(order?.expireAt), format) || '',
    deliveredAt: dateFormat(asDate(order?.deliveredAt), format) || ''
  }
}

const orderPayments = ({ order }: { order: OrderType }) => {
  let res = ''
  const payments = order?.payments
  if (payments?.length == 0) return '*Sin pagos*'
  if (order?.payments?.length > 0) {
    const lastPayment = payments.sort((a, b) => {
      return asDate(a.createdAt) > asDate(b.createdAt) ? -1 : 1
    })[0]

    res += `\nÚltimo pago: ${new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(lastPayment.amount)} ${dictionary(
      lastPayment.method
    )} ${dateFormat(asDate(lastPayment.createdAt), 'dd/MMM/yy HH:mm')}`

    //   res += `
    // \n`
    //   order.payments.forEach((p) => {
    //     res += `${new Intl.NumberFormat('es-MX', {
    //       style: 'currency',
    //       currency: 'MXN'
    //     }).format(p.amount)} ${dictionary(p.method)} ${dateFormat(
    //       asDate(p.createdAt),
    //       'dd/MMM/yy HH:mm'
    //     )} \n`
    //   })
  }
  return res
}
