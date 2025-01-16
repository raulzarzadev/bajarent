import React from 'react'
import theme, { colors } from '../theme'
import Chip, { Size } from './Chip'
import { Text, ViewStyle } from 'react-native'
import OrderType, { order_status } from '../types/OrderType'
import { formatDate, isBefore, isToday } from 'date-fns'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'

const OrderStatus = ({
  order,
  chipStyles,
  chipSize
}: {
  order?: Partial<OrderType>
  chipStyles?: ViewStyle
  chipSize?: Size
}) => {
  if (!order) return <Text>Orden no encontrada</Text>
  const isRent = order.type === 'RENT'
  const isReported = order?.hasNotSolvedReports
  const olderUnsolvedReport = order?.comments?.find(
    (comment) => comment?.type === 'report' && !comment?.solved
  )
  const olderUnsolvedReportDate = olderUnsolvedReport?.createdAt || ''
  const hasImportantComments = order?.comments?.some(
    (comment) => comment?.type === 'important' && !comment?.solved
  )

  const isDelivered = order?.status === order_status.DELIVERED
  const expireToday = isToday(asDate(order?.expireAt))
  const expired = isBefore(asDate(order?.expireAt), new Date())
  const isExpired = (order?.isExpired || expireToday || expired) && isDelivered
  const expiresTomorrow = isRent && isDelivered && order.expiresTomorrow
  const expireLabel = expireToday
    ? 'hoy'
    : `${fromNow(asDate(order?.expireAt))}`

  const isCancelled = order?.status === order_status.CANCELLED
  const isAuthorized = order?.status === order_status.AUTHORIZED
  //const isPending = order?.status === order_status.PENDING

  const isRepairing = order?.status === order_status.REPAIRING
  const isPickedUp = order?.status === order_status.PICKED_UP
  const isRepaired = order?.status === order_status.REPAIRED
  const rentPickedUp = order.type === 'RENT' && isPickedUp
  const repairPickedUp = order.type === 'REPAIR' && isPickedUp
  const repairDelivered = order.type === 'REPAIR' && isDelivered

  const isRenewed =
    order.type === 'RENT' &&
    (order.isRenewed || order?.status === order_status.RENEWED)

  const NullExpireAt =
    !order?.expireAt &&
    order.type === 'RENT' &&
    order.status === order_status.DELIVERED

  const pendingMarketOrder = !!order?.pendingMarketOrder
  const expiresOnMonday = order?.expiresOnMonday
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
          style={[chipStyles, { opacity: 0.4 }]}
          title={dateFormat(asDate(order?.cancelledAt), 'dd/MMM')}
          color={theme.transparent}
          size={chipSize}
          icon={'cancel'}
          iconColor={colors.red}
        />
      )}
      {isRepaired && (
        <Chip
          style={[chipStyles]}
          title={'Listo'}
          color={theme.success}
          titleColor="white"
          size={chipSize}
          icon="done"
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
          style={[chipStyles, { opacity: 0.4 }]}
          title={dateFormat(asDate(order?.pickedUpAt), 'dd/MMM')}
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
          icon="tools"
        />
      )}

      {pendingMarketOrder && (
        <Chip
          style={[chipStyles]}
          title={`${dateFormat(asDate(order?.createdAt), 'dd/MMM')}`}
          icon="www"
          color={theme.transparent}
          size={chipSize}
        />
      )}
      {isAuthorized && (
        <Chip
          style={[chipStyles]}
          title={`${dateFormat(asDate(order?.scheduledAt), 'dd/MMM')}`}
          color={theme.warning}
          size={chipSize}
          icon="calendar"
        />
      )}

      {repairDelivered && (
        <Chip
          style={[chipStyles]}
          title={dateFormat(asDate(order?.deliveredAt), 'dd / MMM')}
          icon="home"
          color={theme.transparent}
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
          color={theme.info}
          // titleColor={theme.white}
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
      {expiresOnMonday && (
        <Chip
          style={[chipStyles]}
          title={'VL'}
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
      {isReported && !!olderUnsolvedReportDate && (
        <Chip
          style={[chipStyles]}
          title={formatDate(asDate(olderUnsolvedReportDate), 'dd/MMM')}
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
    </>
  )
}

export default OrderStatus
