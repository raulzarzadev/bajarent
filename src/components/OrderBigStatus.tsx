import { View, Text } from 'react-native'
import React from 'react'
import OrderType, {
  order_status,
  order_type,
  TypeOrder
} from '../types/OrderType'
import theme, { Colors, colors } from '../theme'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import { useOrderDetails } from '../contexts/orderContext'
import Icon, { IconName } from './Icon'

const OrderBigStatus = () => {
  const { order } = useOrderDetails()
  const isRent = order?.type === order_type.RENT
  const isRepair = order?.type === order_type.REPAIR

  const isCancelled = order?.status === order_status.CANCELLED
  const canceledAt = order?.cancelledAt

  const isDelivered = order?.status === order_status.DELIVERED
  const deliveredAt = order?.deliveredAt

  const isAuthorized = order?.status === order_status.AUTHORIZED
  const authorizedAt = order?.scheduledAt

  const isPending = order?.status === order_status.PENDING
  const pendingAt = order?.createdAt

  const isPickedUp = order?.status === order_status.PICKED_UP
  const pickedUpAt = order?.pickedUpAt

  const isRepairing = order?.status === order_status.REPAIRING && isRepair
  const repairingAt = order?.repairingAt

  const isRepaired = order?.status === order_status.REPAIRED && isRepair
  const repairedAt = order?.repairedAt

  const isExpired = order?.isExpired && isDelivered && isRent
  const expiredAt = order?.expireAt

  const dateInfo = (date) =>
    `${dateFormat(asDate(date), 'dd MMM yy')} (${fromNow(asDate(date))})`

  return (
    <View style={{ marginVertical: 2, flex: 1 }}>
      {isCancelled && (
        <Badge
          color={'error'}
          description={`Motivo: ${order.cancelledReason}`}
          title={`Cancelada ${dateInfo(canceledAt)}`}
          icon="cancel"
        />
      )}
      {isDelivered && !isExpired && (
        <Badge
          color={'info'}
          // description={`Entregada ${order.deliveredAt}`}
          title={`Entregada ${dateInfo(deliveredAt)}`}
          icon="home"
        />
      )}
      {isAuthorized && (
        <Badge
          color={'warning'}
          title={`Pedido ${dateInfo(authorizedAt)}`}
          icon="calendarTime"
        />
      )}
      {isPending && (
        <Badge
          color={'warning'}
          // description={`Pendiente ${order.createdAt}`}
          title={`Pendiente ${dateInfo(pendingAt)}`}
          icon="www"
        />
      )}
      {isRepairing && (
        <Badge
          color={'secondary'}
          // description={`Reparando ${order.repairingAt}`}
          title={`Reparando ${dateInfo(repairingAt)}`}
          icon="repair"
        />
      )}
      {isPickedUp && (
        <Badge
          color={'black'}
          title={`Recogido ${dateInfo(pickedUpAt)}`}
          icon="truck"
        />
      )}
      {isRepaired && (
        <Badge
          color={'success'}
          // description={`Reparado ${order.repairedAt}`}
          title={`Listo ${dateInfo(repairedAt)}`}
          icon="tools"
        />
      )}
      {isExpired && (
        <Badge
          color={'success'}
          // description={`Reparado ${order.repairedAt}`}
          title={`Venció ${dateInfo(expiredAt)}`}
          icon="alarmOff"
        />
      )}
    </View>
  )
}

const Badge = ({
  title,
  color,
  description,
  icon
}: {
  title: string
  color: Colors
  description?: string
  icon?: IconName
}) => {
  return (
    <View style={{ marginVertical: 4 }}>
      <View
        style={{
          borderWidth: 2,
          borderColor: theme[color],
          padding: 4,
          borderRadius: 9999,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {icon && (
          <View style={{ marginRight: 8 }}>
            <Icon icon={icon} size={24} color={theme[color]} />
          </View>
        )}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            textAlignVertical: 'center',
            color: theme[color]
          }}
        >
          {title}
        </Text>
      </View>
      {!!description && (
        <View>
          <Text style={{ textAlign: 'center', marginTop: 4 }}>
            {description}
          </Text>
        </View>
      )}
    </View>
  )
}

export default OrderBigStatus
