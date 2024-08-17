import React from 'react'
import theme, { colors } from '../theme'
import Chip, { Size } from './Chip'
import { Text, View, ViewStyle } from 'react-native'
import OrderType, { order_status } from '../types/OrderType'
import {
  formatDate,
  isBefore,
  isToday,
  isTomorrow,
  isYesterday
} from 'date-fns'
import asDate, {
  dateFormat,
  fromNow,
  isBeforeYesterday
} from '../libs/utils-date'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'

const OrderStatus = ({
  order,
  chipStyles,
  chipSize
}: {
  order?: Partial<OrderType> | Partial<ConsolidatedOrderType>
  chipStyles?: ViewStyle
  chipSize?: Size
}) => {
  if (!order) return <Text>Orden no encontrada</Text>
  const isRent = order.type === 'RENT'
  const isReported = order?.hasNotSolvedReports
  const hasImportantComments = order.comments?.some(
    (comment) => comment.type === 'important' && !comment.solved
  )

  const isDelivered = order?.status === order_status.DELIVERED
  const expireToday = isToday(asDate(order?.expireAt))
  const expired = isBefore(asDate(order?.expireAt), new Date())
  const isExpired = (order?.isExpired || expireToday || expired) && isDelivered
  const expiresTomorrow = isRent && order.expiresTomorrow
  const expireLabel = expireToday
    ? 'hoy'
    : `${fromNow(asDate(order?.expireAt))}`

  const isCancelled = order?.status === order_status.CANCELLED
  const isAuthorized = order?.status === order_status.AUTHORIZED
  const isPending = order?.status === order_status.PENDING

  const isRepairing = order?.status === order_status.REPAIRING
  const isPickedUp = order?.status === order_status.PICKED_UP
  const isRepaired = order?.status === order_status.REPAIRED
  const rentPickedUp = order.type === 'RENT' && isPickedUp
  const repairPickedUp = order.type === 'REPAIR' && isPickedUp
  const repairDelivered = order.type === 'REPAIR' && isDelivered
  const rentAuthorized = order.type === 'RENT' && isAuthorized
  const repairAuthorized = order.type === 'REPAIR' && isAuthorized
  const saleAuthorized = order.type === 'SALE' && isAuthorized
  const isRenewed =
    order.type === 'RENT' &&
    (order.isRenewed || order?.status === order_status.RENEWED)

  const NullExpireAt =
    !order?.expireAt &&
    order.type === 'RENT' &&
    order.status === order_status.DELIVERED
  const scheduledAt = order?.scheduledAt
  const scheduledLabel = () => {
    const scheduledAt = order?.scheduledAt
    if (isBeforeYesterday(asDate(scheduledAt))) {
      return `📅 ${dateFormat(asDate(scheduledAt), '*dd/MMM')}`
    }
    if (isYesterday(asDate(scheduledAt))) {
      return `📅 Ayer`
    }
    if (isToday(asDate(scheduledAt))) {
      return `📅 Hoy`
    }
    if (isTomorrow(asDate(scheduledAt))) {
      return `📅 Mañana`
    }
    if (scheduledAt) {
      return `📅 ${dateFormat(asDate(scheduledAt), 'dd/MMM')}`
    }
  }

  return (
    <>
      {isRenewed && (
        <Chip
          style={[chipStyles]}
          title={'Renovada'}
          color={theme.transparent}
          size={chipSize}
        />
      )}
      {isCancelled && (
        <Chip
          style={[chipStyles]}
          title={'Cancelada'}
          color={theme.transparent}
          size={chipSize}
          icon={'cancel'}
          iconColor={colors.red}
        />
      )}
      {isRepaired && (
        <Chip
          style={[chipStyles]}
          title={'Reparado'}
          color={theme.warning}
          size={chipSize}
        />
      )}
      {repairPickedUp && (
        <Chip
          style={[chipStyles]}
          title={'Recogida'}
          color={theme.secondary}
          size={chipSize}
          titleColor={colors.white}
        />
      )}
      {rentPickedUp && (
        <Chip
          style={[chipStyles, { opacity: 0.2 }]}
          title={dateFormat(asDate(order?.pickedUpAt), 'dd / MMM')}
          color={theme.transparent}
          size={chipSize}
          icon="truck"
        />
      )}
      {isRepairing && (
        <Chip
          style={[chipStyles]}
          title={'Reparando'}
          color={theme.secondary}
          size={chipSize}
          titleColor={colors.white}
        />
      )}

      {isPending && (
        <Chip
          style={[chipStyles]}
          title={'Pendiente'}
          color={theme.transparent}
          size={chipSize}
        />
      )}
      {rentAuthorized && (
        <Chip
          style={[chipStyles]}
          title={'Pedido'}
          color={theme.warning}
          size={chipSize}
        />
      )}
      {repairAuthorized && (
        <Chip
          style={[chipStyles]}
          title={'Pedido'}
          color={theme.success}
          size={chipSize}
          titleColor={colors.white}
        />
      )}
      {saleAuthorized && (
        <Chip
          style={[chipStyles]}
          title={'Pedido'}
          color={theme.warning}
          size={chipSize}
        />
      )}
      {repairDelivered && (
        <Chip
          style={[chipStyles]}
          title={dateFormat(asDate(order?.deliveredAt), 'dd / MMM')}
          icon="home"
          color={theme.success}
          size={chipSize}
        />
      )}

      {/* 
      //* Chip of rent order status Pedido | Entregada | Recogida 
      //*                           🔖 | 🏠 22/Mar | 🛻
      */}

      {/* if is rented, and not expires yet. Show date */}
      {isRent && isDelivered && !expiresTomorrow && !isExpired && (
        <Chip
          style={[chipStyles]}
          title={dateFormat(asDate(order?.expireAt), 'dd / MMM')}
          icon="home"
          color={theme.transparent}
          size={chipSize}
        />
      )}

      {/* if is rented, and expires tomorrow. Show VM */}

      {expiresTomorrow && (
        <Chip
          style={[chipStyles]}
          title={'VM'}
          color={theme.success}
          icon={'alarm'}
          size={chipSize}
          titleColor={colors.white}
        />
      )}

      {/* if is rented, and expires today. Show time ago */}

      {isExpired && (
        <Chip
          style={[chipStyles]}
          icon="alarmOff"
          title={`${expireLabel || ''}`}
          color={theme.success}
          size={chipSize}
          titleColor={colors.white}
        />
      )}
      {NullExpireAt && (
        <Chip
          style={[chipStyles]}
          title={'SF'}
          color={theme.error}
          size={chipSize}
          titleColor={colors.white}
        />
      )}

      {/* Reports and importante badges */}
      {isReported && (
        <Chip
          style={[chipStyles]}
          title={''}
          color={theme.error}
          icon="report"
          size={chipSize}
          titleColor={colors.white}
        />
      )}
      {hasImportantComments && (
        <Chip
          style={[chipStyles]}
          title={''}
          icon="warning"
          color={theme.warning}
          size={chipSize}
          titleColor={theme.accent}
        />
      )}

      {!!scheduledAt && isAuthorized && (
        <Chip
          style={[chipStyles]}
          title={scheduledLabel()}
          color={colors.transparent}
          size={chipSize}
        />
      )}
    </>
  )
}

export default OrderStatus
