import { isToday, isTomorrow } from 'date-fns'
import dictionary from '../dictionary'
import OrderType, { order_status, OrderQuoteType } from '../types/OrderType'
import StoreType from '../types/StoreType'
import asDate, {
  dateFormat,
  endDate,
  fromNow,
  isAfterTomorrow,
  isBeforeYesterday
} from './utils-date'
import PaymentType from '../types/PaymentType'

export const expiredMessage = ({
  order,
  store
}: {
  order: OrderType
  store: StoreType
}) => {
  return `🚨 *ALERTA DE VENCIMIENTO* 
  \n${WELCOME({ customerName: order?.fullName, storeName: store?.name })}
  \n${expireDateString(order, { feePerDay: 100 })}
  ${ORDER_DETAILS({
    orderType: order.type,
    orderFolio: order.folio
  })}
  ${ORDER_ITEMS({ order })} 
  \n${BANK_INFO({ store })}
  \nEnvíe su comprobante al Whatsapp  ${
    store?.contacts?.find((c) => c.type === 'whatsapp')?.value
  } 
  \n${AGRADECIMIENTOS({ storeName: store?.name })}
  ` //<--- remplace `\n` with \r to mark the end of the line
}
export const receiptMessage = ({
  order,
  storeName
}: {
  order: Partial<OrderType>
  storeName: string
}) => {
  return `🧾 *COMPROBANTE DE PAGO* 
  \n${WELCOME({ customerName: order?.fullName, storeName })}
  ${ORDER_DETAILS({
    orderType: order?.type,
    orderFolio: order?.folio
  })}
  ${ORDER_ITEMS({ order })} 
  ${LAST_PAYMENT({ lastPayment: order?.payments?.[0] })}
  ${AGRADECIMIENTOS({ storeName })}
  `
}

export const rentStarted = ({
  order,
  storeName,
  lastPayment
}: {
  order: Partial<OrderType>
  storeName: string
  lastPayment?: Partial<PaymentType>
}) => {
  return `✅ *ARTÍCULO ENTREGADO* 
  \n${WELCOME({ customerName: order?.fullName, storeName })}
  ${ORDER_DETAILS({
    orderType: order?.type,
    orderFolio: order?.folio
  })}
  ${ORDER_ITEMS({ order })} 
  ${expireDateString(order, { feePerDay: 100 })}
  ${LAST_PAYMENT({ lastPayment: lastPayment || order?.payments?.[0] })}
  ${AGRADECIMIENTOS({ storeName })}
  `
}

export const rentFinished = ({
  order,
  storeName
}: {
  order: Partial<OrderType>
  storeName: string
}) => {
  return `🔚 *RENTA FINALIZADA* 
  \n${WELCOME({ customerName: order?.fullName, storeName })}
  ${ORDER_DETAILS({
    orderType: order?.type,
    orderFolio: order?.folio
  })} 
  ${ORDER_ITEMS({ order })} 
  ${AGRADECIMIENTOS({ storeName })}
  `
}

export const rentRenewed = ({
  order,
  storeName,
  lastPayment
}: {
  order: Partial<OrderType>
  storeName: string
  lastPayment?: Partial<PaymentType>
}) => {
  return `🔄 *RENOVACIÓN DE RENTA* 
  \n${WELCOME({ customerName: order?.fullName, storeName })}
  ${ORDER_DETAILS({
    orderType: order?.type,
    orderFolio: order?.folio
  })}
  ${ORDER_ITEMS({ order })} 
  ${expireDateString(order, { feePerDay: 100 })}
  \n${LAST_PAYMENT({ lastPayment: lastPayment || order?.payments?.[0] })}
  \n${AGRADECIMIENTOS({ storeName })}
  `
}
export const orderStatus = ({ order, storeName }) => {
  return `ℹ️ *INFORMACIÓN DE SU SERVICIO*
  \n${WELCOME({ customerName: order?.fullName, storeName })}
  ${ORDER_DETAILS({
    orderType: order?.type,
    orderFolio: order?.folio
  })}
  ${ORDER_ITEMS({ order })}
  \n${
    order && order?.type === 'RENT'
      ? expireDateString(order, { feePerDay: 100 })
      : repairORderStatus({ order })
  }
  \n${LAST_PAYMENT({ lastPayment: order?.payments?.[0] })}
  \n${AGRADECIMIENTOS({ storeName })}
  `
}

const AGRADECIMIENTOS = ({ storeName }) =>
  `*${storeName}* agradece su preferencia 🙏🏼`

const WELCOME = ({ customerName, storeName }) => `Estimado *${customerName}* `

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
  orderFolio
}: {
  orderType: OrderType['type']
  orderFolio: OrderType['folio']
}) => `\nFolio: *${orderFolio}*\nTipo: *${dictionary(orderType)}*`

const ORDER_ITEMS = ({ order }) => {
  if (order?.type === 'RENT') {
    return `\nArtículo(s): *${order?.items
      ?.map((i) => `${i.categoryName || ''} ${i.number || ''}`)
      ?.join(', ')}*`
  } else {
    return `Ⓜ️ Marca: *${
      order?.item?.brand || order?.itemBrand || ''
    }*\n #️⃣ Serie: *${
      order?.item?.serial || order?.itemSerial || ''
    }*\n ⚙️ Falla: *${
      order?.item?.failDescription || order?.failDescription || ''
    }*
    `
  }
}
const expireDateString = (order: Partial<OrderType>, { feePerDay }) => {
  const expireDate = asDate(order?.expireAt)

  if (isToday(expireDate)) {
    return `Vencimiento: *HOY* 😔. \n${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  if (isTomorrow(expireDate)) {
    return `Vencimiento: *MAÑANA* 😔. \n${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  if (isAfterTomorrow(expireDate)) {
    return `Vencimiento: *${dateFormat(
      expireDate,
      'EEEE dd MMMM yy'
    )}* (${fromNow(expireDate)})`
  }
  // Su servicio📄 de RENTA de Lavadora: 1706 tiene
  // "X" dias de atraso y un adeudo de (X dias x $100)

  if (isBeforeYesterday(expireDate)) {
    return `Vencimiento: *${dateFormat(
      expireDate,
      'EEEE dd MMMM yy'
    )}* (${fromNow(expireDate)})\n ${FEE_ADVERT({
      atTheEndOfDay: true,
      expireDate,
      feePerDay
    })}`
  }
  return ''
}

const repairORderStatus = ({ order }: { order: OrderType }) => {
  const orderQuotes = order?.quotes as OrderQuoteType[]
  const orderStatus = order?.status
  const quotesTotal = orderQuotes?.reduce(
    (prev, curr) => prev + parseFloat(`${curr.amount}`),
    0
  )
  const stringTotal = `Total: *$${quotesTotal?.toFixed(2)}*`
  const quotes = orderQuotes
    ?.map((q) => {
      return `${q.description} *$${parseFloat(`${q?.amount}`).toFixed(2)}* `
    })
    .join('\n')

  let status = ''
  if (orderStatus === order_status.AUTHORIZED)
    status = `*AUTORIZADA* _(agendad para revisión)_`

  if (orderStatus === order_status.PENDING)
    status = `*PENDIENTE* _(en espera de confirmación del técnico)_`

  if (orderStatus === order_status.CANCELLED) status = `*CANCELADA*  `

  if (orderStatus === order_status.REPAIRING)
    status = `*EN REPARACIÓN* \n${quotes} \n$${stringTotal}`

  if (orderStatus === order_status.PICKED_UP)
    status = `*RECOGIDA*  \n${quotes} \n$${stringTotal}`

  if (orderStatus === order_status.REPAIRED)
    status = `*TERMINADA* _(en espera de pago/entrega)_  \n${quotes} \n$${stringTotal}`

  if (orderStatus === order_status.DELIVERED) status = `*ENTREGADA*`

  return `Estado actual: ${status}`
}

const FEE_ADVERT = ({ expireDate, feePerDay, atTheEndOfDay }) => {
  const { amount, days } = getLateFee({ expireDate, feePerDay, atTheEndOfDay })
  return amount > 0
    ? `\n*DEUDA actual $${amount}*  _($${feePerDay} x ${days} días vencidos)_`
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

const LAST_PAYMENT = ({
  lastPayment
}: {
  lastPayment: Partial<PaymentType>
}) => {
  //TODO last valid payment
  if (!lastPayment) return 'Sin pagos'
  return `Último pago: *$${lastPayment.amount}* _${shortMethod(
    lastPayment.method
  )}_ ${dateFormat(asDate(lastPayment?.createdAt), 'dd/MM/yy HH:mm')} `
}
export const shortMethod = (method) => {
  if (method === 'transfer') return 'Tr'
  if (method === 'cash') return 'Ef'
  if (method === 'card') return 'Tj'
  return method
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
