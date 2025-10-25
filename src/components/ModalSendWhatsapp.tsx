import { View, Text, Linking } from 'react-native'
import { useState } from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import OrderType, {
  order_status,
  order_type,
  OrderQuoteType
} from '../types/OrderType'
import dictionary from '../dictionary'
import asDate, {
  dateFormat,
  endDate,
  fromNow,
  isAfterTomorrow,
  isBeforeYesterday
} from '../libs/utils-date'
import { useStore } from '../contexts/storeContext'
import { translateTime } from '../libs/expireDate'
import SpanCopy from './SpanCopy'
import { isToday, isTomorrow } from 'date-fns'
import ErrorBoundary from './ErrorBoundary'
import { useOrderDetails } from '../contexts/orderContext'
import { onSendOrderWhatsapp } from '../libs/whatsapp/sendOrderMessage'
import { useAuth } from '../contexts/authContext'
import ButtonConfirm from './ButtonConfirm'
import TextInfo from './TextInfo'
import { orderStatus } from '../libs/whatsappMessages'
import { useCustomer } from './Customers/ScreenCustomer'
import InputRadios from './Inputs/InputRadios'
import { useEmployee } from '../contexts/employeeContext'

//FIXME: This just works for orders, but it shows in profile:
export default function ModalSendWhatsapp({
  justIcon = false,
  whatsappPhone
}: ModalSendWhatsappType) {
  const modal = useModal({ title: 'Enviar mensaje' })

  const { order, payments } = useOrderDetails()
  const { customer } = useCustomer()
  const { store, categories } = useStore()
  const { employee } = useEmployee()
  const phone = whatsappPhone

  const invalidPhone = !phone || phone?.length < 10
  const item = order?.items?.[0]
  const FEE_PER_DAY = 100
  const getLateFee = ({
    expireDate,
    feePerDay = 100,
    atTheEndOfDay
  }: {
    expireDate: Date
    feePerDay: number
    atTheEndOfDay?: boolean
  }): { days: number; amount: number } => {
    const expireAt = atTheEndOfDay
      ? endDate(asDate(expireDate))
      : asDate(expireDate)
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
  const WELCOME = `Estimado ${
    customer?.name || order?.fullName || ''
  } cliente de ${store?.name}`

  const ORDER_TYPE = `Tipo de servicio: *${dictionary(
    order?.type
  )}*\nArtículo: *${item?.categoryName || 'Lavadora'}*\nFolio: *${
    order?.folio
  }*`

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

  const AGRADECIMIENTOS = `*${store?.name}* agradece su preferencia 🙏🏼`

  const RENT_PERIOD = `Periodo contratado: ${
    translateTime(order?.items?.[0]?.priceSelected?.time) || ''
  }

  ➡ Inicio: ${orderStringDates(order).deliveredAt}
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
    feePerDay: FEE_PER_DAY,
    atTheEndOfDay: true // avoid fee if the date of expire is today
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
      return `Su contrato *VENCE HOY* 😔. ${FEE_ADVERT}`
    }
    if (isTomorrow(date)) {
      return `Su contrato *VENCE MAÑANA* 😔. ${FEE_ADVERT}`
    }
    if (isAfterTomorrow(date)) {
      return `Su contrato VENCE EL ${dateFormat(
        date,
        'EEEE dd MMMM yy'
      )} (${fromNow(date)})`
    }
    // Su servicio📄 de RENTA de Lavadora: 1706 tiene
    // "X" dias de atraso y un adeudo de (X dias x $100)

    if (isBeforeYesterday(date)) {
      return `Su contrato VENCIÓ el ${dateFormat(
        date,
        'EEEE dd MMMM yy'
      )} (${fromNow(date)}) ${FEE_ADVERT}`
    }
    return ''
  }

  const SOCIALS = store?.socialMedia
    ?.map((s) => `${s.type || ''}: ${s.value || ''}`)
    ?.join('\n')

  const SOCIAL_MEDIA = `📲 Síguenos en nuestras redes sociales:
  ${SOCIALS || ''}`

  const orderNote = order?.note || ''

  const ORDER_DETAILS = `
  Folio: *${order?.folio}*${orderNote && `\nNota: ${orderNote}`}
  Servicio: ${dictionary(order?.type)}
  Status: ${dictionary(order?.status)}`

  const RENT_EXPIRE_DATE = `🚨 *ALERTA DE VENCIMIENTO* 
  \n${WELCOME}
  \n${ORDER_TYPE}
  \n${expireDateString(order)}
  \n${BANK_INFO}
  \nEnviar su comprobante al Whatsapp  ${
    store?.mobile
  } y esperar confirmación 👌🏼
  \nEn caso de *NO CONTINUAR* con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}
  `

  const RECEIPT_START = `🧾 *RECIBO DE PAGO*
  \n${WELCOME}
  \n${ORDER_TYPE}`

  const RENT_RECEIPT = `${RECEIPT_START}
  \n${RENT_PERIOD}
  \n${FEE_ADVERT}
  \n${PAYMENTS}
  \n${CONTACTS}
  \n${ADDRESS}`

  const orderQuotes = (order?.quotes as OrderQuoteType[]) || []

  const QUOTE =
    orderQuotes.length > 0
      ? `🔧 *Servicios:*\n${orderQuotes
          .map(
            (q) =>
              `${q.description} *$${parseFloat(`${q.amount}`).toFixed(2)}* `
          )
          .join('\n')}
    \nTotal:*$${orderQuotes
      .reduce((prev, curr) => prev + parseFloat(`${curr.amount}`), 0)
      .toFixed(2)}*
  `
      : ''

  const ORDER_DATES = `Fechas
  \n${getReceiptDates(order)}`
  const orderItemCategoryName =
    categories?.find((cat) => cat?.id === order?.item?.categoryId)?.name || ''
  const itemFailure =
    order.type === order_type.REPAIR &&
    (order?.item?.failDescription || order?.itemFailure || '')

  order?.item?.failDescription ?? order?.failDescription ?? ''

  const itemSerial = order?.item?.serial || order?.itemSerial || ''
  const ORDER_ITEM_DETAILS = `
  ℹ️ *Información del artículo*
  🧸 Tipo: ${orderItemCategoryName}
  🏷️ Marca: ${order?.item?.brand || order?.itemBrand || ''} ${
    itemSerial && `\n#️⃣ Serie: ${itemSerial}`
  } ${itemFailure && `\n❕ Falla: ${itemFailure}`}
`

  const REPAIR_QUOTE = `🧾 *COTIZACIÓN*
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}  
  ${QUOTE}
  🗓️ Garantía 1 Mes
  
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}`

  const REPAIR_RECEIPT = `${RECEIPT_START}
  \n📆${ORDER_DATES}
  
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
    | 'repair-quote'

  const CLIENT_NOT_FOUND = `
  \n🔎*NO TE ENCOTRAMOS*
  ${WELCOME}
  \nNo pudimos ponernos en contacto con usted.
  \nPor favor póngase en contacto a lo teléfonos:
  \n${PHONES}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}
  `

  const REPAIR_PICKED_UP = `🚛 REPARACIÓN RECOLECTADA
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${QUOTE}
  \n${CONTACTS}
  \n${ADDRESS}
  \n${AGRADECIMIENTOS}`

  const QUALITY_SURVEY = `
  📨 *AYUDANOS A MEJORAR*
  \n${WELCOME}
  \nPor favor contesta la siguiente encuesta de calidad de servicio.
  \nhttps://forms.gle/1kBa9yeZyP9rc6YeA
  \n${AGRADECIMIENTOS}
  \n${CONTACTS}
  `
  const GOOGLE_MAPS_COMMENT = `🌟 *Reseña* 
  \n${WELCOME}
  \nLe agradecemos, si puede regálenos una buena reseña de 5 estrellas en https://g.page/r/CeBtdpdVAA_cEBM/review  y  mencione que lo atendio: ${
    employee?.name || ''
  }
  \n${AGRADECIMIENTOS}
  \n${CONTACTS}
  `

  // \nSi te gusto el servicio y quieres recomendarnos, deja un comentario en Google Maps
  // \nhttps://www.google.com/maps/place/Lavarenta/@24.1505656,-110.3167882,21z/data=!4m11!1m2!2m1!1slavarneta+bcs!3m7!1s0x86afd345060536b7:0xdc0f005597766de0!8m2!3d24.1506412!4d-110.3166235!9m1!1b1!16s%2Fg%2F11b6bgc0l8?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D

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
    },
    {
      type: 'repair-quote',
      content: REPAIR_QUOTE
    }
  ]

  const [messageType, setMessageType] = useState<MessageType>(null)
  const [message, setMessage] = useState<string>()
  // messages.find((m) => m.type === messageType)?.content
  let options: { label: string; value: MessageType }[] = [
    { label: 'Vacío', value: 'hello' },
    { label: 'Encuesta', value: 'rent-quality-survey' },
    { label: 'Información', value: 'store-info' },
    { label: '5 estrellas', value: 'google-maps-comment' },
    { label: 'No encontrado', value: 'not-found' }
  ]
  if (order?.type === order_type.RENT) {
    options.push({ label: 'Vencimiento', value: 'expireAt' })
    options.push({ label: 'Recibo', value: 'receipt-rent' })
  }
  if (order?.type === order_type.REPAIR) {
    options.push({ label: 'Recibo', value: 'receipt-repair' })
    options.push({ label: 'Recogido', value: 'repair-picked-up' })
    options.push({ label: 'Cotización', value: 'repair-quote' })
  }

  const handleResetMessage = () => {
    setMessageType(null)
    setMessage(null)
  }
  const [error, setError] = useState('')

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
          onChange={(value) => {
            setMessageType(value)
            setMessage(messages.find((m) => m.type === value)?.content || '')
          }}
          layout="row"
          stylesRow={{ justifyContent: 'center' }}
          stylesOption={{ marginHorizontal: 4 }}
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
              gStyles.helperError,
              { textAlign: 'center', marginVertical: 6 }
            ]}
          >
            *Numero de Teléfono invalido
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
        <TextInfo
          text="⬇Los siguientes mensajes se envían desde el numero de la tienda"
          defaultVisible
          type="info"
        ></TextInfo>
        <View style={{ marginVertical: 8 }}>
          <ButtonSendWhatsappStatatusE phone={phone} setError={setError} />
          {!!error && <Text style={gStyles.helperError}>*Error: {error}</Text>}
        </View>
      </StyledModal>
    </View>
  )
}

export const ButtonSendWhatsappStatatus = (
  props: ButtonSendWhatsappStatatusProps
) => {
  const phone = props?.phone
  const { order, payments } = useOrderDetails()
  const { store } = useStore()
  const { user } = useAuth()
  const [sending, setSending] = useState(false)
  const message = orderStatus({
    order,
    storeName: store?.name || ''
  })
  if (!order) return <></>
  return (
    <ButtonConfirm
      modalTitle="Enviar mensaje de estado"
      openLabel="Enviar estado actual de la orden"
      openDisabled={sending}
      confirmDisabled={sending}
      handleConfirm={async () => {
        setSending(true)
        await onSendOrderWhatsapp({
          order: { ...order, payments },
          phone: phone,
          store,
          type: 'sendAuthorizedOrder',
          userId: user.id
        })
          .then((res) => {
            console.log(res)
            res.error && props?.setError(res.error)
          })
          .catch((e) => console.log({ e }))
        setSending(false)
      }}
      confirmLabel="Enviar"
      icon={'whatsapp'}
      openColor="success"
      confirmColor="success"
    >
      <TextInfo
        text="Se enviara el siguiente mensaje"
        defaultVisible
        type="info"
      ></TextInfo>
      <Text>{message}</Text>
    </ButtonConfirm>
  )
}
export type ButtonSendWhatsappStatatusProps = {
  phone: string
  setError: (e: string) => void
}
export const ButtonSendWhatsappStatatusE = (
  props: ButtonSendWhatsappStatatusProps
) => (
  <ErrorBoundary componentName="ButtonSendWhatsappStatatus">
    <ButtonSendWhatsappStatatus {...props} />
  </ErrorBoundary>
)

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
