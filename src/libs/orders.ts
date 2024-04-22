import { isBefore, isToday } from 'date-fns'
import { CommentType } from '../types/CommentType'
import OrderType, { order_status } from '../types/OrderType'
import { expireDate2 } from './expireDate'
import asDate from './utils-date'

export const formatOrders = ({
  orders,
  reports = [],
  justActive = false
}: {
  orders: OrderType[]
  reports?: CommentType[]
  justActive?: boolean
}) => {
  const ordersWithExpireDate = orders.map((order) => {
    const formattedOrder = formatOrder({ order, comments: reports })
    return formattedOrder
  })

  if (justActive) {
    return activeOrders(ordersWithExpireDate)
  }

  return ordersWithExpireDate
}

export const formatOrder = ({ order, comments }) => {
  const orderComments = comments.filter(
    (comment) => comment.orderId === order.id
  )
  const reportsNotSolved = orderComments.some(
    ({ type, solved }) => type === 'report' && !solved
  )
  // if (reportsNotSolved.length) console.log({ reportsNotSolved })
  if (order.type === 'RENT') {
    const expireOrder = orderExpireAt({ order })
    return {
      ...order,
      comments: orderComments,
      expireAt: expireOrder,
      isExpired: isBefore(expireOrder, new Date()) || isToday(expireOrder),
      hasNotSolvedReports: reportsNotSolved
    }
  }
  if (order.type === 'REPAIR') {
    return {
      ...order,
      comments: orderComments,
      expireAt: null,
      hasNotSolvedReports: reportsNotSolved
    }
  }
  if (order.type === 'SALE') {
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

export const orderExpireAt = ({ order }: { order: OrderType }) => {
  const orderItemsExpireDate = order?.items?.map((item) => {
    const expireAt = expireDate2({
      startedAt: order.deliveredAt || order.scheduledAt,
      price: item.priceSelected,
      priceQty: item.priceQty
    })
    return { ...item, expireAt }
  })

  let expireAt = null
  if (!!order?.items?.length) {
    //* sort items by expireAt and choose the nearest one as expire date for all order
    expireAt = orderItemsExpireDate.sort((a, b) => {
      return asDate(a?.expireAt)?.getTime() - asDate(b?.expireAt)?.getTime()
    })[0].expireAt
  } else {
    //* if order has no items, use the order expire date
    expireAt = expireDate2({
      startedAt: order.deliveredAt || order.scheduledAt,
      price: order?.item?.priceSelected,
      priceQty: order?.item?.priceQty
    })
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
