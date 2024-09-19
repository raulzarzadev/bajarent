import { View, Text, Linking } from 'react-native'
import React, { useState } from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import theme from '../theme'
import OrderType, {
  order_status,
  order_type,
  OrderQuoteType
} from '../types/OrderType'
import dictionary from '../dictionary'
import asDate, {
  dateFormat,
  fromNow,
  isAfterTomorrow,
  isBeforeYesterday
} from '../libs/utils-date'
import { useStore } from '../contexts/storeContext'
import InputRadios from './InputRadios'
import { translateTime } from '../libs/expireDate'
import SpanCopy from './SpanCopy'
import { isToday, isTomorrow } from 'date-fns'
import ErrorBoundary from './ErrorBoundary'
import { useOrderDetails } from '../contexts/orderContext'
//FIXME: This just works for orders, but it shows in profile:
export default function ModalSendWhatsapp({
  justIcon = false,
  whatsappPhone
}: ModalSendWhatsappType) {
  const modal = useModal({ title: 'Enviar mensaje' })
  // const [order, setOrder] = useState<OrderType>()
  const { order, payments } = useOrderDetails()
  const phone = whatsappPhone
  const invalidPhone = !phone || phone?.length < 10
  const { store } = useStore()
  const item = order?.items?.[0]
  const FEE_PER_DAY = 100
  const getLateFee = ({
    expireDate,
    feePerDay = 100
  }: {
    expireDate: Date
    feePerDay: number
  }): { days: number; amount: number } => {
    const expireAt = asDate(expireDate)
    const today = new Date()
    const days = Math.ceil(
      (today.getTime() - expireAt?.getTime()) / (1000 * 3600 * 24)
    )
    // const amount = order?.items?.[0]?.priceSelected?.amount || 0
    return {
      days,
      amount: feePerDay * days
    }
  }
  //*********  MEMES
  const WELCOME = `Estimado ${order?.fullName} cliente de ${store?.name}`
  const ORDER_TYPE = `Su servicio📄 de ${
    dictionary(order?.type)?.toUpperCase() || ''
  } ${item?.categoryName ? `de ${item?.categoryName}` : ''}: *${order?.folio}* `
  const BANK_INFO = `Favor de transferir 💸  únicamente a cualquiera de las siguientes cuentas a nombre de ${
    store?.name
  } y/o ${store?.accountHolder || ''}:
  \n${store?.bankInfo
    ?.map(({ bank, clabe }) => {
      if (!bank) return ''
      return `🏦 ${bank} ${clabe}\n`
    })
    .join('')}`

  const PHONES = `📞 ${store?.phone}
📱 ${store?.mobile} Whatsapp`

  const orderExpiresAt = order?.expireAt

  const CONTACTS = `Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:\n${PHONES}
`

  const AGRADECIMIENTOS = `De antemano le agradecemos su atención 🙏🏼`

  const RENT_PERIOD = `Periodo contratado: ${
    translateTime(order?.items?.[0]?.priceSelected?.time) || ''
  }

  ⏳ Inicio: ${orderStringDates(order).deliveredAt}
  🔚 Vencimiento: ${dateFormat(asDate(orderExpiresAt), 'EEEE dd MMMM yy')}`

  const PRICE = `💲${order?.items?.[0]?.priceSelected?.amount?.toFixed(2) || 0}`
  const PAYMENTS = ` ${orderPayments({ order: { ...order, payments } })}`
  const ADDRESS = `📍${store?.address ? `Dirección: ${store.address}` : ''}`
  const SCHEDULE = store?.schedule
    ? `🕒 Horario de atención: ${store?.schedule || ''}`
    : ''
  //******** MESSAGES
  const fee = getLateFee({
    expireDate: asDate(order?.expireAt),
    feePerDay: FEE_PER_DAY
  })

  // const FEE_ADVERT = `\n\nRecargos: $${FEE_PER_DAY}mxn x día de retraso 📆 \n${
  //   fee.amount > 0
  //     ? `Presenta un adeudo de *$${fee.amount} de recargos por ${fee.days}  de retraso en su renovación*`
  //     : ''
  // }`
  //Su DEUDA hasta hoy por 9 días vencido es de $900 ($100 x 9 días)

  const FEE_ADVERT =
    fee?.amount > 0
      ? `\n\n*Su DEUDA hasta hoy por ${fee?.days} días vencidos es de $${fee?.amount}  ($${FEE_PER_DAY} x ${fee.days} días)*`
      : `\n\nRENOVAR o ENTREGAR a tiempo, evitara multas y recargos de *$${FEE_PER_DAY}mxn x día* `

  const expireDateString = (order) => {
    const date = asDate(order?.expireAt)

    if (isToday(date)) {
      return `*VENCE HOY* 😔. ${FEE_ADVERT}`
    }
    if (isTomorrow(date)) {
      return `*VENCE MAÑANA* 😔. ${FEE_ADVERT}`
    }
    if (isAfterTomorrow(date)) {
      return `VENCE EL ${dateFormat(date, 'EEEE dd MMMM yy')} (${fromNow(
        date
      )})`
    }
    // Su servicio📄 de RENTA de Lavadora: 1706 tiene
    // "X" dias de atraso y un adeudo de (X dias x $100)

    if (isBeforeYesterday(date)) {
      return `VENCIÓ el ${dateFormat(date, 'EEEE dd MMMM yy')} (${fromNow(
        date
      )}) ${FEE_ADVERT}`
    }
    return ''
  }

  const SOCIALS = store?.socialMedia
    ?.map((s) => `${s.type || ''}: ${s.value || ''}`)
    ?.join('\n')

  const SOCIAL_MEDIA = `📲 Síguenos en nuestras redes sociales:
  ${SOCIALS || ''}`

  const RENT_EXPIRE_DATE = `${WELCOME}
  \n${ORDER_TYPE}  ${expireDateString(order)}
  \n${BANK_INFO}
  \nEnviar su comprobante al Whatsapp  ${
    store?.mobile
  } y esperar confirmación 👌🏼
  \nEn caso de *NO CONTINUAR* con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}
  `

  const RENT_RECEIPT = `${WELCOME}
  \n${ORDER_TYPE}
  \n${RENT_PERIOD}
  \n${FEE_ADVERT}
  \n${PAYMENTS}
  \n${CONTACTS}
  \n${ADDRESS}`

  const orderQuotes = (order?.quotes as OrderQuoteType[]) || []

  const QUOTE = `🧾 *Cotización*
  ${orderQuotes
    .map(
      (q) => `
  💲*${parseFloat(`${q.amount}`).toFixed(2)}* ${q.description}`
    )
    .join('\n')}

    Cotización total:      💲*${orderQuotes
      .reduce((prev, curr) => prev + parseFloat(`${curr.amount}`), 0)
      .toFixed(2)}*
  `

  const ORDER_DATES = `Fechas
  \n${getReceiptDates(order)}`

  const REPAIR_RECEIPT = `
  \n${WELCOME}
  \n${ORDER_TYPE}
  \n📆${ORDER_DATES}
  \n🔧 *Información del aparato*
  🛠️ Marca: ${order?.item?.brand || order?.itemBrand || ''}
  #️⃣ Serie: ${order?.item?.serial || order?.itemSerial || ''} 
  \n${QUOTE}
  🗓️ Garantía 1 Mes
  
  \n${PAYMENTS}
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}`

  const STORE_INFO = `
  \n${store?.name}
  \n${BANK_INFO}
  \n${ADDRESS}
  \n${SCHEDULE}
  \n${CONTACTS}
  \n${SOCIAL_MEDIA}
  
  \n${AGRADECIMIENTOS}
  `
  type MessageType =
    | 'expireAt'
    | 'receipt-rent'
    | 'receipt-repair'
    | 'not-found'
    | 'repair-picked-up'
    | 'rent-quality-survey'
    | 'store-info'
    | 'hello'
    | 'google-maps-comment'

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
  \n⬆️🔧 Se recogió para servicio el  📆${dFormat(order.repairingAt)}
  \n🛠️ Marca: ${order?.itemBrand || ''}
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
  const GOOGLE_MAPS_COMMENT = `${WELCOME}
  \n¿Te gusto el servicio? Dejanos un comentario en Google Maps
  \nhttps://www.google.com/maps/place/Lavarenta/@24.1505656,-110.3167882,21z/data=!4m11!1m2!2m1!1slavarneta+bcs!3m7!1s0x86afd345060536b7:0xdc0f005597766de0!8m2!3d24.1506412!4d-110.3166235!9m1!1b1!16s%2Fg%2F11b6bgc0l8?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D
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
    },
    {
      type: 'store-info',
      content: STORE_INFO
    },
    {
      type: 'hello',
      content: ` `
    },
    {
      type: 'google-maps-comment',
      content: GOOGLE_MAPS_COMMENT
    }
  ]

  const [messageType, setMessageType] = useState<MessageType>(null)
  const [message, setMessage] = useState<string>()
  // messages.find((m) => m.type === messageType)?.content
  let options = []
  if (order?.type === order_type.RENT) {
    options = [
      { label: 'Vacío', value: 'hello' },
      { label: 'Vencimiento', value: 'expireAt' },
      { label: 'Recibo', value: 'receipt-rent' },
      { label: 'No encontrado', value: 'not-found' },
      { label: 'Encuesta', value: 'rent-quality-survey' },
      { label: 'Información', value: 'store-info' },
      { label: 'Google Maps', value: 'google-maps-comment' }
    ]
  }
  if (order?.type === order_type.REPAIR) {
    options = [
      { label: 'Vacío', value: 'hello' },
      { label: 'Recibo', value: 'receipt-repair' },
      { label: 'No encontrado', value: 'not-found' },
      { label: 'Recogido', value: 'repair-picked-up' },
      { label: 'Información', value: 'store-info' },
      { label: 'Google Maps', value: 'google-maps-comment' }
    ]
  }

  const handleResetMessage = () => {
    setMessageType(null)
    setMessage(null)
  }

  return (
    <View>
      {justIcon ? (
        <Button
          icon="whatsapp"
          onPress={() => {
            modal.toggleOpen()
            handleResetMessage()
          }}
          justIcon
          variant="ghost"
          color="success"
        />
      ) : (
        <Button
          label="Whatsapp"
          onPress={() => {
            // handleGetOrderInfo()
            modal.toggleOpen()
            handleResetMessage()
          }}
          size="small"
          icon="whatsapp"
        ></Button>
      )}
      <StyledModal
        {...modal}
        onclose={() => {
          handleResetMessage()
        }}
      >
        <InputRadios
          options={options}
          value={messageType}
          setValue={(value) => {
            setMessageType(value)
            setMessage(messages.find((m) => m.type === value)?.content || '')
          }}
          layout="row"
        />
        {message && (
          <View style={{ marginVertical: 6 }}>
            <SpanCopy label={'Copiar'} copyValue={message} />
          </View>
        )}
        <Text style={{ marginVertical: 12 }}>{message}</Text>

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

        {invalidPhone && (
          <Text
            style={[
              gStyles.helperError,
              { textAlign: 'center', marginVertical: 6 }
            ]}
          >
            *Numero de telefono invalido
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

const dFormat = (date: Date) =>
  date ? dateFormat(asDate(date), 'dd/MMM/yy HH:mm') : ''

const getReceiptDates = (order: OrderType): string => {
  if (!order) return ''
  const isRent = order?.type === order_type.RENT
  const isRepair = order?.type === order_type.REPAIR

  let dates = [`Creada ${dFormat(order.createdAt)}`]
  if (isRent) {
    const isDelivered = order?.status === order_status.DELIVERED
    const isPickedUp = order?.status === order_status.PICKED_UP
    if (isDelivered && order.deliveredAt)
      dates.push(`Entregada ${dFormat(order?.deliveredAt)}`)
    if (isPickedUp && order?.pickedUpAt)
      dates.push(`Recogida ${dFormat(order?.pickedUpAt)}`)
  }
  if (isRepair) {
    const isRepairing = order?.status === order_status.REPAIRING
    const isRepaired = order?.status === order_status.REPAIRED
    const isDelivered = order?.status === order_status.DELIVERED
    if (order.repairingAt) dates.push(`Comenzada ${dFormat(order.repairingAt)}`)
    if (order.repairedAt) dates.push(`Terminada ${dFormat(order.repairedAt)}`)
    if (order.deliveredAt) dates.push(`Entregada ${dFormat(order.deliveredAt)}`)
  }
  return dates.join('\n')
  //
  // const isRepairing = order?.status === order_status.REPAIRING
  // const isDelivered = order?.status === order_status.DELIVERED
  // const defaultDate = new Date()
  // if (isRepair && isRepairing) {
  //   return defaultDate
  // }
  // if (isRent && isDelivered) {
  //   return asDate(order.deliveredAt)
  // }
  // return defaultDate
}
const orderStringDates = (
  order: Partial<OrderType>,
  format = 'EEEE dd MMMM yy'
) => {
  if (order?.extensions) {
    const lastExtension = Object.values(order?.extensions || {})?.sort(
      (a, b) => {
        return asDate(a.createdAt).getTime() > asDate(b.createdAt).getTime()
          ? -1
          : 1
      }
    )[0]
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

export type ModalSendWhatsappType = {
  justIcon?: boolean
  whatsappPhone?: string
}
export const ModalSendWhatsappE = (props: ModalSendWhatsappType) => (
  <ErrorBoundary componentName="ModalSendWhatsapp">
    <ModalSendWhatsapp {...props} />
  </ErrorBoundary>
)

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
