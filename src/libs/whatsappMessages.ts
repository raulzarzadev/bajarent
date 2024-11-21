import { isToday, isTomorrow } from 'date-fns'
import dictionary from '../dictionary'
import OrderType from '../types/OrderType'
import StoreType from '../types/StoreType'
import asDate, {
  dateFormat,
  endDate,
  fromNow,
  isAfterTomorrow,
  isBeforeYesterday
} from './utils-date'

// const buildWhatsappMessage = ({ store, order }) => {
//   const phone = whatsappPhone

//   const invalidPhone = !phone || phone?.length < 10
//   const { store } = useStore()
//   const item = order?.items?.[0]
//   const FEE_PER_DAY = 100
//   const getLateFee = ({
//     expireDate,
//     feePerDay = 100,
//     atTheEndOfDay
//   }: {
//     expireDate: Date
//     feePerDay: number
//     atTheEndOfDay?: boolean
//   }): { days: number; amount: number } => {
//     const expireAt = atTheEndOfDay
//       ? endDate(asDate(expireDate))
//       : asDate(expireDate)
//     const today = new Date()
//     const days = Math.ceil(
//       (today.getTime() - expireAt?.getTime()) / (1000 * 3600 * 24)
//     )
//     // const amount = order?.items?.[0]?.priceSelected?.amount || 0
//     return {
//       days,
//       amount: feePerDay * days
//     }
//   }
//   //*********  MEMES
//   const WELCOME = `Estimado ${order?.fullName} cliente de ${store?.name}`

//   const ORDER_TYPE = `Tipo de servicio: *${dictionary(
//     order?.type
//   )}*\nArtículo: *${item?.categoryName || 'Lavadora'}*\nFolio: *${
//     order?.folio
//   }*`

//   const BANK_INFO = `Favor de transferir 💸  únicamente a cualquiera de las siguientes cuentas a nombre de ${
//     store?.name
//   } y/o ${store?.accountHolder || ''}:
//   \n${store?.bankInfo
//     ?.map(({ bank, clabe }) => {
//       if (!bank) return ''
//       return `🏦 ${bank} ${clabe}\n`
//     })
//     .join('')}`

//   const PHONES = `📞 ${store?.phone}
// 📱 ${store?.mobile} Whatsapp`

//   const orderExpiresAt = order?.expireAt

//   const CONTACTS = `Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:\n${PHONES}
// `

//   const AGRADECIMIENTOS = `*${store.name}* agradece su preferencia 🙏🏼`

//   const RENT_PERIOD = `Periodo contratado: ${
//     translateTime(order?.items?.[0]?.priceSelected?.time) || ''
//   }

//   ➡ Inicio: ${orderStringDates(order).deliveredAt}
//   🔚 Vencimiento: ${dateFormat(asDate(orderExpiresAt), 'EEEE dd MMMM yy')}`

//   const PRICE = `💲${order?.items?.[0]?.priceSelected?.amount?.toFixed(2) || 0}`
//   const PAYMENTS = ` ${orderPayments({ order: { ...order, payments } })}`
//   const ADDRESS = `📍${store?.address ? `Dirección: ${store.address}` : ''}`
//   const SCHEDULE = store?.schedule
//     ? `🕒 Horario de atención: ${store?.schedule || ''}`
//     : ''
//   //******** MESSAGES
//   const fee = getLateFee({
//     expireDate: asDate(order?.expireAt),
//     feePerDay: FEE_PER_DAY,
//     atTheEndOfDay: true // avoid fee if the date of expire is today
//   })

//   // const FEE_ADVERT = `\n\nRecargos: $${FEE_PER_DAY}mxn x día de retraso 📆 \n${
//   //   fee.amount > 0
//   //     ? `Presenta un adeudo de *$${fee.amount} de recargos por ${fee.days}  de retraso en su renovación*`
//   //     : ''
//   // }`
//   //Su DEUDA hasta hoy por 9 días vencido es de $900 ($100 x 9 días)

//   const FEE_ADVERT =
//     fee?.amount > 0
//       ? `\n\n*Su DEUDA hasta hoy por ${fee?.days} días vencidos es de $${fee?.amount}  ($${FEE_PER_DAY} x ${fee.days} días)*`
//       : `\n\nRENOVAR o ENTREGAR a tiempo, evitara multas y recargos de *$${FEE_PER_DAY}mxn x día* `

//   const SOCIALS = store?.socialMedia
//     ?.map((s) => `${s.type || ''}: ${s.value || ''}`)
//     ?.join('\n')

//   const SOCIAL_MEDIA = `📲 Síguenos en nuestras redes sociales:
//   ${SOCIALS || ''}`

//   const RENT_EXPIRE_DATE = `🚨 *ALERTA DE VENCIMIENTO*
//   \n${WELCOME}
//   \n${ORDER_TYPE}
//   \n${expireDateString(order, { feePerDay: FEE_PER_DAY })}
//   \n${BANK_INFO}
//   \nEnviar su comprobante al Whatsapp  ${
//     store?.mobile
//   } y esperar confirmación 👌🏼
//   \nEn caso de *NO CONTINUAR* con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras.
//   \n${CONTACTS}
//   \n${ADDRESS}
//   \n${AGRADECIMIENTOS}
//   `

//   const RECEIPT_START = `🧾 *RECIBO DE PAGO*
//   \n${WELCOME}
//   \n${ORDER_TYPE}`

//   const RENT_RECEIPT = `${RECEIPT_START}
//   \n${RENT_PERIOD}
//   \n${FEE_ADVERT}
//   \n${PAYMENTS}
//   \n${CONTACTS}
//   \n${ADDRESS}`

//   const orderQuotes = (order?.quotes as OrderQuoteType[]) || []

//   const QUOTE = `🧾 *Cotización*
//   ${orderQuotes
//     .map(
//       (q) => `
//   💲*${parseFloat(`${q.amount}`).toFixed(2)}* ${q.description}`
//     )
//     .join('\n')}

//     Cotización total:      💲*${orderQuotes
//       .reduce((prev, curr) => prev + parseFloat(`${curr.amount}`), 0)
//       .toFixed(2)}*
//   `

//   const ORDER_DATES = `Fechas
//   \n${getReceiptDates(order)}`

//   const REPAIR_RECEIPT = `${RECEIPT_START}
//   \n📆${ORDER_DATES}
//   \n🔧 *Información del aparato*
//   🛠️ Marca: ${order?.item?.brand || order?.itemBrand || ''}
//   #️⃣ Serie: ${order?.item?.serial || order?.itemSerial || ''}
//   \n${QUOTE}
//   🗓️ Garantía 1 Mes

//   \n${PAYMENTS}
//   \n${CONTACTS}
//   \n${ADDRESS}
//   \n${AGRADECIMIENTOS}`

//   const STORE_INFO = `
//   \n${store?.name}
//   \n${BANK_INFO}
//   \n${ADDRESS}
//   \n${SCHEDULE}
//   \n${CONTACTS}
//   \n${SOCIAL_MEDIA}

//   \n${AGRADECIMIENTOS}
//   `
//   type MessageType =
//     | 'expireAt'
//     | 'receipt-rent'
//     | 'receipt-repair'
//     | 'not-found'
//     | 'repair-picked-up'
//     | 'rent-quality-survey'
//     | 'store-info'
//     | 'hello'
//     | 'google-maps-comment'

//   const CLIENT_NOT_FOUND = `${WELCOME}
//   \nNo pudimos ponernos en contacto con usted para atender ${ORDER_TYPE}
//   \nResponde este mensaje o póngase en contacto a lo teléfonos :
//   \n${PHONES}
//   \n${ADDRESS}
//   \n${AGRADECIMIENTOS}
//   `

//   const REPAIR_PICKED_UP = `
//   \n${WELCOME}
//   \n${ORDER_TYPE}
//   \n⬆️🔧 Se recogió para servicio el  📆${dFormat(order?.repairingAt)}
//   \n🛠️ Marca: ${order?.item?.brand || order?.itemBrand || ''}
//   #️⃣ Serie: ${order?.item?.serial || order?.itemSerial || ''}
//   🧾 Falla: ${order?.item?.failDescription || order?.failDescription || ''}
//   💲 Cotización:  $${order?.repairTotal || 0}

//   \n${CONTACTS}
//   \n${ADDRESS}
//   \n${AGRADECIMIENTOS}`

//   const QUALITY_SURVEY = `${WELCOME}
//   \nAyudanos a mejorar el servicio con esta breve encuesta.
//   \nhttps://forms.gle/1kBa9yeZyP9rc6YeA
//   \n${AGRADECIMIENTOS}
//   \n${CONTACTS}
//   `
//   const GOOGLE_MAPS_COMMENT = `🌟 *COMPARTE *
//   \n${WELCOME}
//   \nNos encantaría recibir tus comentarios. Publica una opinión en nuestro perfil.
//   \nhttps://g.page/r/CeBtdpdVAA_cEBE/review
//   \n${AGRADECIMIENTOS}
//   \n${CONTACTS}
//   `

//   // \nSi te gusto el servicio y quieres recomendarnos, deja un comentario en Google Maps
//   // \nhttps://www.google.com/maps/place/Lavarenta/@24.1505656,-110.3167882,21z/data=!4m11!1m2!2m1!1slavarneta+bcs!3m7!1s0x86afd345060536b7:0xdc0f005597766de0!8m2!3d24.1506412!4d-110.3166235!9m1!1b1!16s%2Fg%2F11b6bgc0l8?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D

//   const messages: { type: MessageType; content: string }[] = [
//     // {
//     //   type: 'upcomingExpire',
//     //   content: RENT_EXPIRE_SOON
//     // },
//     // {
//     //   type: 'expireToday',
//     //   content: RENT_EXPIRE_TODAY
//     // },
//     {
//       type: 'not-found',
//       content: CLIENT_NOT_FOUND
//     },
//     {
//       type: 'receipt-rent',
//       content: RENT_RECEIPT
//     },
//     {
//       type: 'receipt-repair',
//       content: REPAIR_RECEIPT
//     },
//     {
//       type: 'expireAt',
//       content: RENT_EXPIRE_DATE
//     },
//     {
//       type: 'repair-picked-up',
//       content: REPAIR_PICKED_UP
//     },
//     {
//       type: 'rent-quality-survey',
//       content: QUALITY_SURVEY
//     },
//     {
//       type: 'store-info',
//       content: STORE_INFO
//     },
//     {
//       type: 'hello',
//       content: ` `
//     },
//     {
//       type: 'google-maps-comment',
//       content: GOOGLE_MAPS_COMMENT
//     }
//   ]

//   const [messageType, setMessageType] = useState<MessageType>(null)
//   const [message, setMessage] = useState<string>()
//   // messages.find((m) => m.type === messageType)?.content
//   let options = []
//   if (order?.type === order_type.RENT) {
//     options = [
//       { label: 'Vacío', value: 'hello' },
//       { label: 'Vencimiento', value: 'expireAt' },
//       { label: 'Recibo', value: 'receipt-rent' },
//       { label: 'No encontrado', value: 'not-found' },
//       { label: 'Encuesta', value: 'rent-quality-survey' },
//       { label: 'Información', value: 'store-info' },
//       { label: 'Google Maps', value: 'google-maps-comment' }
//     ]
//   }
//   if (order?.type === order_type.REPAIR) {
//     options = [
//       { label: 'Vacío', value: 'hello' },
//       { label: 'Recibo', value: 'receipt-repair' },
//       { label: 'No encontrado', value: 'not-found' },
//       { label: 'Recogido', value: 'repair-picked-up' },
//       { label: 'Información', value: 'store-info' },
//       { label: 'Google Maps', value: 'google-maps-comment' }
//     ]
//   }

//   const handleResetMessage = () => {
//     setMessageType(null)
//     setMessage(null)
//   }
// }

export const expiredMessage = ({
  order,
  store
}: {
  order: OrderType
  store: StoreType
}) => {
  return `🚨 *ALERTA DE VENCIMIENTO* 
  \n${WELCOME({ customerName: order?.fullName, storeName: store?.name })}
  \n${
    order
      ? ORDER_DETAILS({
          orderType: order.type,
          orderFolio: order.folio,
          orderItems:
            order?.items
              ?.map((i) => `${i.categoryName} ${i.number}`)
              ?.join(', ') || order?.item?.categoryName
        })
      : ''
  }
  \n${expireDateString(order, { feePerDay: 100 })}
  \n${BANK_INFO({ store })}
  \nEnvíe su comprobante al Whatsapp  ${
    store?.contacts?.find((c) => c.type === 'whatsapp')?.value
  } 
  \n${AGRADECIMIENTOS({ store })}
  `
}
export const receiptMessage = ({
  order,
  store
}: {
  order: OrderType
  store: StoreType
}) => {
  return `🧾 *COMPROBANTE DE PAGO* 
  \n${WELCOME({ customerName: order?.fullName, storeName: store?.name })}
  \n${
    !!order
      ? ORDER_DETAILS({
          orderType: order?.type,
          orderFolio: order?.folio,
          orderItems:
            order?.items
              ?.map((i) => `${i.categoryName} ${i.number}`)
              ?.join(', ') || order?.item?.categoryName
        })
      : ''
  }
  \n${LAST_PAYMENT({ order })}
 
  \n${AGRADECIMIENTOS({ store })}
  `
}

const AGRADECIMIENTOS = ({ store }) =>
  `*${store.name}* agradece su preferencia 🙏🏼`

const WELCOME = ({ customerName, storeName }) =>
  `Estimado ${customerName} cliente de ${storeName}`

/**
 * Generates order details message.
 *
 * @param {Object} params - The parameters for generating the order details message.
 * @param {OrderType['type']} params.orderType - The type of the order.
 * @param {OrderType['folio']} params.orderFolio - The folio of the order.
 * @param {string} params.orderItems - The items in the order as string Ej. lavadora 2022, Secadora 2033.
 * @returns {string} The order details message.
 */
const ORDER_DETAILS = ({
  orderType,
  orderFolio,
  orderItems
}: {
  orderType: OrderType['type']
  orderFolio: OrderType['folio']
  orderItems: string
}) =>
  `Folio: *${orderFolio}*\nTipo: *${dictionary(
    orderType
  )}*\nArtículo(s): *${orderItems}*`

const expireDateString = (order, { feePerDay }) => {
  const expireDate = asDate(order?.expireAt)

  if (isToday(expireDate)) {
    return `Su contrato *VENCE HOY* 😔. ${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  if (isTomorrow(expireDate)) {
    return `Su contrato *VENCE MAÑANA* 😔. ${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  if (isAfterTomorrow(expireDate)) {
    return `Su contrato VENCE el ${dateFormat(
      expireDate,
      'EEEE dd MMMM yy'
    )} (${fromNow(expireDate)})`
  }
  // Su servicio📄 de RENTA de Lavadora: 1706 tiene
  // "X" dias de atraso y un adeudo de (X dias x $100)

  if (isBeforeYesterday(expireDate)) {
    return `Su contrato VENCIÓ el ${dateFormat(
      expireDate,
      'EEEE dd MMMM yy'
    )} (${fromNow(expireDate)}) ${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  return ''
}

const FEE_ADVERT = ({ expireDate, feePerDay, atTheEndOfDay }) => {
  const { amount, days } = getLateFee({ expireDate, feePerDay, atTheEndOfDay })
  return amount > 0
    ? `\n\n*Su DEUDA hasta hoy por ${days} días vencidos es de $${amount}  ($${feePerDay} x ${days} días)*`
    : //: `\n\nRENOVAR o ENTREGAR a tiempo, evitara multas y recargos de *$${feePerDay}mxn x día* `
      `\nEvite *RECARGOS* al renovar o entregar a tiempo (*$${feePerDay}mxn x día*) `
}

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
  return {
    days,
    amount: feePerDay * days
  }
}

const LAST_PAYMENT = ({ order }) => {
  const lastPayment = order?.payments?.[0]
  if (!lastPayment) return ''
  return `Último pago: $${lastPayment.amount} ${dateFormat(
    asDate(lastPayment.date),
    'dd MMMM yy'
  )}`
}

const BANK_INFO = ({
  store
}) => `Transferir 💸  únicamente a las siguientes cuentas a nombre de ${
  store?.name
} y/o ${store?.accountHolder || ''}:
\n${store?.bankInfo
  ?.map(({ bank, clabe }) => {
    if (!bank) return ''
    return `🏦 ${bank} ${clabe}\n`
  })
  .join('')}`
