import React from 'react'
import theme, { colors } from '../theme'
import Chip, { Size } from './Chip'
import { Text, ViewStyle } from 'react-native'
import OrderType, { order_status } from '../types/OrderType'
import { isBefore, isToday } from 'date-fns'
import asDate, { fromNow } from '../libs/utils-date'
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
  const isDelivered = order?.status === order_status.DELIVERED
  const expireToday = isToday(asDate(order?.expireAt))
  const expired = isBefore(asDate(order?.expireAt), new Date())
  const isExpired = (order?.isExpired || expireToday || expired) && isDelivered
  const expiresTomorrow = isRent && order.expiresTomorrow
  const expireLabel = expireToday
    ? 'Vence hoy'
    : `venció ${fromNow(asDate(order?.expireAt))}`

  const isCancelled = order?.status === order_status.CANCELLED
  const isAuthorized = order?.status === order_status.AUTHORIZED
  const isPending = order?.status === order_status.PENDING

  const isRepairing = order?.status === order_status.REPAIRING
  const isPickedUp = order?.status === order_status.PICKED_UP
  const isRepaired = order?.status === order_status.REPAIRED
  const rentPickedUp = order.type === 'RENT' && isPickedUp
  const repairPickedUp = order.type === 'REPAIR' && isPickedUp
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
          style={[chipStyles]}
          title={'Recogida'}
          color={theme.transparent}
          size={chipSize}
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
      {!isExpired && isDelivered && (
        <Chip
          style={[chipStyles]}
          title={'Entregada'}
          color={theme.transparent}
          size={chipSize}
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
      {isExpired && (
        <Chip
          style={[chipStyles]}
          title={`${expireLabel || ''}`}
          color={theme.success}
          size={chipSize}
        />
      )}
      {isReported && (
        <Chip
          style={[chipStyles]}
          title={'Reporte'}
          color={theme.error}
          size={chipSize}
        />
      )}
      {expiresTomorrow && (
        <Chip
          style={[chipStyles]}
          title={'VM'}
          color={theme.success}
          size={chipSize}
        />
      )}
      {NullExpireAt && (
        <Chip
          style={[chipStyles]}
          title={'SF'}
          color={theme.error}
          size={chipSize}
        />
      )}
    </>
  )
}

export default OrderStatus
