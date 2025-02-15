import {
  formatDate,
  isBefore,
  isMonday,
  isSaturday,
  isToday,
  isTomorrow
} from 'date-fns'
import { CommentType } from '../types/CommentType'
import OrderType, { order_status, OrderExtensionType } from '../types/OrderType'
import { LabelRentType, expireDate2, translateTime } from './expireDate'
import asDate from './utils-date'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { TimePriceType } from '../types/PriceType'
import { ExtendReason } from '../firebase/ServiceOrders'
import { CustomerType } from '../state/features/costumers/customerType'
import { getFavoriteCustomerPhone } from '../components/Customers/lib/lib'

export const formatOrders = ({
  orders,
  reports = [],
  justActive = false,
  customers = []
}: {
  orders: Partial<OrderType>[]
  reports?: CommentType[]
  justActive?: boolean
  customers?: Partial<CustomerType>[]
}) => {
  const ordersWithExpireDate = orders
    .map((order) => {
      const customer = customers.find((c) => c.id === order?.customerId)

      const formattedOrder = formatOrder({
        order: order as OrderType,
        comments: reports,
        customer
      })
      return formattedOrder
    })
    // remove duplicates
    .reduce((acc, current) => {
      const x = acc.find((item) => item?.id === current?.id)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])

  if (justActive) {
    return activeOrders(ordersWithExpireDate)
  }

  return ordersWithExpireDate
}

export const formatOrder = ({
  order,
  comments = [],
  customer
}: {
  order: OrderType
  comments: CommentType[]
  customer?: Partial<CustomerType>
}) => {
  const orderComments = comments?.filter(
    (comment) => comment?.orderId === order?.id
  )
  const reportsNotSolved = orderComments?.some(
    ({ type, solved }) => type === 'report' && !solved
  )
  let formattedOrder = { ...order }
  console.log({ formattedOrder })
  formattedOrder.comments = orderComments
  formattedOrder.hasNotSolvedReports = reportsNotSolved
  formattedOrder.pendingMarketOrder =
    formattedOrder?.status === order_status.PENDING &&
    formattedOrder.marketOrder

  if (customer) {
    formattedOrder.fullName = customer.name
    formattedOrder.neighborhood = customer.address.neighborhood
    formattedOrder.address = customer.address.street
    formattedOrder.phone = getFavoriteCustomerPhone(customer.contacts)
  }

  if (formattedOrder?.type === 'RENT') {
    const expireAt = order.expireAt
    const expireToday = isToday(asDate(expireAt))
    // const expireAt = orderExpireAt({ order })
    const isExpired =
      !!expireAt && (isBefore(asDate(expireAt), new Date()) || expireToday)
    const expiresToday = expireToday

    return {
      ...formattedOrder,
      isExpired,
      expireAt,
      expiresToday,
      expiresTomorrow: isTomorrow(asDate(expireAt)),
      // today is saturday, is not expires yet and expires on monday
      expiresOnMonday:
        isSaturday(new Date()) && isMonday(asDate(expireAt)) && !isExpired
    }
  }
  if (formattedOrder?.type === 'REPAIR') {
    return {
      ...formattedOrder,
      expireAt: null
    }
  }
  if (formattedOrder?.type === 'SALE') {
    return {
      ...formattedOrder,
      expireAt: null
    }
  }

  return {
    ...formattedOrder,
    pendingMarketOrder:
      formattedOrder?.status === order_status.PENDING &&
      !!formattedOrder.marketOrder
  }
}

export const activeOrders = (ordersFormatted: OrderType[]) => {
  return ordersFormatted.filter((o) => {
    //* if has reports not solved, return true
    if (o.hasNotSolvedReports) return true
    //* if is cancelled or renewed, return false
    if ([order_status.CANCELLED, order_status.RENEWED].includes(o.status))
      return false

    //* if is REPAIR and status is in [AUTHORIZED, PICKED_UP,REPAIRING, REPAIRED], return true
    if (o.type === 'REPAIR') {
      return [
        order_status.AUTHORIZED,
        order_status.REPAIRING,
        order_status.REPAIRED,
        order_status.PICKED_UP
      ].includes(o.status)
    }
    //* if is RENT and status is in [AUTHORIZED], or isExpired return true
    if (o.type === 'RENT') {
      if (o.status === order_status.AUTHORIZED || o.isExpired) return true
    }
  })
}

export const orderExpireAt = ({
  order
}: {
  order: Partial<OrderType>
}): Date | null => {
  let expireAt = null
  //* if order is not RENT, return null
  if (order.type !== 'RENT') {
    return null
  }
  if (order.extensions) {
    const expireExtensions = Object.values(order?.extensions || {}).sort(
      //* put the last extension first
      (a, b) => asDate(b.createdAt)?.getTime() - asDate(a.createdAt)?.getTime()
    )
    return expireExtensions?.[0]?.expireAt || null
  }
  const orderItemsExpireDate = order?.items?.map((item) => {
    const expireAt = expireDate2({
      startedAt: order.deliveredAt || order.scheduledAt,
      price: item.priceSelected,
      priceQty: item.priceQty,
      extendTime: order?.extendTime
    })
    return { ...item, expireAt }
  })

  if (!!order?.items?.length) {
    //* sort items by expireAt and choose the nearest one as expire date for all order
    expireAt = orderItemsExpireDate.sort((a, b) => {
      return asDate(a?.expireAt)?.getTime() - asDate(b?.expireAt)?.getTime()
    })[0].expireAt
  } else {
    //* if order has no items, use the order expire date
    console.log('order has no items')
    //*******  show expire as null
    expireAt = null
  }
  return expireAt
}

export const filterActiveOrders = (orders: OrderType[]) => {
  return orders.filter((o) => {
    if (o.status === order_status.CANCELLED) return false
    if (o.status === order_status.RENEWED) return false

    if (o.type === 'REPAIR') {
      return [
        order_status.AUTHORIZED,
        order_status.REPAIRING,
        order_status.REPAIRED,
        order_status.PICKED_UP
      ].includes(o.status)
    }
    if (o.type === 'RENT') {
      return [order_status.AUTHORIZED, order_status.DELIVERED].includes(
        o.status
      )
    }
    if (o.type === 'SALE') {
      return [order_status.AUTHORIZED].includes(o.status)
    }
  })
}

export const currentRentPeriod = (
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>,
  props?: { shortLabel?: boolean }
): LabelRentType => {
  const shortLabel = props?.shortLabel || false
  if (order?.type === 'RENT') {
    const hasExtensions = Object.values(order?.extensions || {}).sort(
      (a: OrderExtensionType, b: OrderExtensionType) =>
        asDate(b?.expireAt)?.getTime() - asDate(a?.expireAt)?.getTime()
    )
    if (hasExtensions?.length) {
      //* <--------- already has extensions
      const lastExtension = hasExtensions[0] as OrderExtensionType
      return translateTime(lastExtension?.time, { shortLabel })
    } else {
      //* <--------- use items to detereminate the expire date
      return translateTime(order?.items?.[0]?.priceSelected?.time, {
        shortLabel
      })
    }
  }
  return ''
}

export const lastExtensionTime = (
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>
): TimePriceType | null => {
  const extensionsArr = Object.values(order?.extensions || {})
  if (!extensionsArr.length && order?.items?.[0]?.priceSelected) {
    return order?.items?.[0]?.priceSelected?.time
  }
  const lastExtension = extensionsArr.sort(
    (a: OrderExtensionType, b: OrderExtensionType) =>
      asDate(b?.expireAt)?.getTime() - asDate(a?.expireAt)?.getTime()
  )[0] as OrderExtensionType

  return lastExtension?.time || null
}
export const orderExtensionsBetweenDates = ({
  order,
  fromDate,
  toDate,
  reason = 'extension'
}: {
  order: Partial<OrderType>
  fromDate: Date
  toDate: Date
  reason?: ExtendReason
}): OrderExtensionType[] => {
  const extensions = Object.values(order?.extensions || {})
  const isBetween = (date: Date) =>
    isBefore(date, asDate(toDate)) && isBefore(asDate(fromDate), date)
  return extensions
    .filter((e) => e.reason === reason)
    .filter((e) => isBetween(asDate(e.createdAt)))
    .map((e) => ({ ...e, orderId: order.id }))
}

export const getTodayRenews = ({
  orders
}: {
  orders: Partial<OrderType>[]
}) => {
  const renewsToday = orders
    .map((order) => {
      const todayExtensions = Object.values(order?.extensions || {}).filter(
        (e) => e.reason === 'renew' && isToday(asDate(e.createdAt))
      )
      return todayExtensions.map((e) => ({ ...e, orderId: order.id }))
    })

    .flat()
  return renewsToday
}

export const isRenewedToday = (order: Partial<OrderType>): boolean => {
  const lastExtension = Object.values(order?.extensions || {})
    .filter((e) => e.reason === 'renew')
    .sort(
      (a, b) =>
        asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime()
    )[0]
  return isToday(asDate(lastExtension?.createdAt))
}

export const orderAsExcelFormat = (order?: Partial<OrderType>) => {
  const {
    id,
    note = '',
    fullName = '',
    phone = '',
    neighborhood = '',
    address = '',
    references = '',
    scheduledAt = ''
  } = order || {}
  return `${note}\t${fullName}\t${formatPhone(
    phone
  )}\t${neighborhood}\t${address}\t${references}\t${
    scheduledAt ? formatDate(asDate(scheduledAt), 'dd/MM/yyyy') : ''
  }\n`
}

export const excelFormatToOrder = (
  excelRow: string
): Pick<
  OrderType,
  | 'note'
  | 'fullName'
  | 'phone'
  | 'neighborhood'
  | 'address'
  | 'references'
  | 'scheduledAt'
> => {
  const [
    note,
    fullName,
    phone,
    neighborhood,
    address,
    references,
    scheduledAt
  ] = excelRow.split('\t')

  return {
    note,
    fullName,
    phone: formatPhone(phone),
    neighborhood,
    address,
    references,
    scheduledAt: asDate(scheduledAt)
  }
}
const formatPhone = (phone: string) => {
  //if phone is empty, return null
  if (!phone) return null
  //if phone start with +52 remove it
  if (phone.startsWith('+52')) return phone.slice(3)
  //if phone start with 52 remove and is 12 digits, remove it
  if (phone.startsWith('52') && phone.length === 12) return phone.slice(2)

  return ''
}
