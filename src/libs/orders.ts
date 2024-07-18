import { isBefore, isToday, isTomorrow } from 'date-fns'
import { CommentType } from '../types/CommentType'
import OrderType, { order_status } from '../types/OrderType'
import { LabelRentType, expireDate2, translateTime } from './expireDate'
import asDate from './utils-date'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { TimePriceType } from '../types/PriceType'

export const formatOrders = ({
  orders,
  reports = [],
  justActive = false
}: {
  orders: Partial<OrderType>[]
  reports?: CommentType[]
  justActive?: boolean
}) => {
  const ordersWithExpireDate = orders
    .map((order) => {
      const formattedOrder = formatOrder({ order, comments: reports })
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

export const formatOrder = ({ order, comments = [] }) => {
  const orderComments = comments?.filter(
    (comment) => comment?.orderId === order?.id
  )
  const reportsNotSolved = orderComments?.some(
    ({ type, solved }) => type === 'report' && !solved
  )

  if (order?.type === 'RENT') {
    const expireAt = order.expireAt
    const expireToday = isToday(asDate(expireAt))
    // const expireAt = orderExpireAt({ order })
    const isExpired =
      !!expireAt && (isBefore(asDate(expireAt), new Date()) || expireToday)
    const expiresToday = expireToday

    return {
      ...order,

      comments: orderComments,
      hasNotSolvedReports: reportsNotSolved,
      isExpired,
      expireAt,
      expiresToday,
      expiresTomorrow: isTomorrow(asDate(expireAt))
    }
  }
  if (order?.type === 'REPAIR') {
    return {
      ...order,

      comments: orderComments,
      expireAt: null,
      hasNotSolvedReports: reportsNotSolved
    }
  }
  if (order?.type === 'SALE') {
    return {
      ...order,

      comments: orderComments,
      expireAt: null,
      hasNotSolvedReports: reportsNotSolved
    }
  }
  return order
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
      (a, b) => asDate(b?.expireAt)?.getTime() - asDate(a?.expireAt)?.getTime()
    )
    if (hasExtensions?.length) {
      //* <--------- already has extensions
      const lastExtension = hasExtensions[0]
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
    (a, b) => asDate(b?.expireAt)?.getTime() - asDate(a?.expireAt)?.getTime()
  )[0]

  return lastExtension?.time || null
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
