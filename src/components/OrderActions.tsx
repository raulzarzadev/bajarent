import { StyleSheet, View } from 'react-native'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'

const OrderActions = ({ order }: { order: Partial<OrderType> }) => {
  const navigation = useNavigation()
  const status = orderStatus(order)
  const orderId = order?.id || ''

  const disabledDeliveryButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.PENDING,
    order_status.RENEWED
  ].includes(status)

  const disabledCancelButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.DELIVERED,
    order_status.EXPIRED,
    order_status.RENEWED
  ].includes(status)

  const disabledAuthorizeButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.DELIVERED,
    order_status.EXPIRED,
    order_status.RENEWED
  ].includes(status)

  const disabledEditButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.RENEWED
  ].includes(status)

  const disabledAssignButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.RENEWED
  ].includes(status)

  const disabledRenewButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.RENEWED,
    order_status.AUTHORIZED
  ].includes(status)

  // const assignedTo = staff?.find((s) => s?.id === order?.assignTo)
  // const assignedName = assignedTo?.name || assignedTo?.position

  return (
    <View style={{ padding: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 200,
          width: '100%',
          margin: 'auto'
        }}
      >
        <OrderStatus orderId={orderId} />
      </View>
      <P bold>Acciones de orden</P>
      <View style={styles.container}>
        {order.status === order_status.PICKUP && (
          <View style={styles.item}>
            <ButtonDelivery orderId={orderId} cancelPickup />
          </View>
        )}
        <View style={styles.item}>
          <ButtonDelivery
            orderId={orderId}
            disabled={disabledDeliveryButton}
            isDelivered={status === order_status.DELIVERED}
            isExpired={status === order_status.EXPIRED}
          />
        </View>
        <View style={styles.item}>
          <ButtonRenew orderId={orderId} disabled={disabledRenewButton} />
        </View>
        <View style={styles.item}>
          <ButtonCancel
            orderId={orderId}
            disabled={disabledCancelButton}
            isCancelled={status === order_status.CANCELLED}
          />
        </View>
        <View style={styles.item}>
          <ButtonAuthorize
            orderId={orderId}
            disabled={disabledAuthorizeButton}
            isAuthorized={status === order_status.AUTHORIZED}
          />
        </View>

        <View style={styles.item}>
          <Button
            disabled={disabledEditButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('EditOrder', { orderId })
            }}
            label="Editar"
          />
        </View>

        <View style={styles.item}>
          <Button
            disabled={disabledAssignButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('AssignOrder', { orderId })
            }}
            label={`${
              order.assignToPosition
                ? `Asignado a: ${order.assignToPosition}`
                : 'Asignar'
            }`}
          />
        </View>
        <View style={styles.item}>
          <Button
            color="error"
            variant="outline"
            // disabled={disabledAssignButton}
            onPress={() => {
              ServiceOrders.delete(orderId).then((res) => {
                console.log('deleted', res)
                navigation.goBack()
              })
            }}
            label="Eliminar orden"
          />
        </View>
      </View>
    </View>
  )
}
const ButtonCancel = ({ orderId, isCancelled, disabled }) => {
  const { storeId } = useStore()
  const handleCancel = () => {
    ServiceOrders.update(orderId, {
      status: isCancelled ? order_status.PENDING : order_status.CANCELLED
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      content: isCancelled ? 'Orden reanudada' : 'Orden cancelada',
      type: 'comment',
      orderId,
      storeId
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <>
      <Button
        disabled={disabled}
        label={isCancelled ? 'Reanudar orden' : 'Cancelar orden'}
        onPress={() => {
          handleCancel()
        }}
      />
    </>
  )
}
const ButtonAuthorize = ({ orderId, isAuthorized, disabled }) => {
  const { storeId } = useStore()
  const handleAuthorize = () => {
    ServiceOrders.update(orderId, {
      status: isAuthorized ? order_status.PENDING : order_status.AUTHORIZED
    })
      .then(console.log)
      .catch(console.error)

    ServiceOrders.addComment({
      content: isAuthorized ? 'Orden no autorizada' : 'Orden autorizada',
      type: 'comment',
      orderId,
      storeId
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <>
      <Button
        variant="outline"
        disabled={disabled}
        label={isAuthorized ? 'No autorizar' : 'Autorizar'}
        onPress={() => {
          handleAuthorize()
        }}
      />
    </>
  )
}

const ButtonRenew = ({ orderId, disabled }) => {
  const { storeId, orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  console.log({ order })
  const handleRenew = async () => {
    const order = orders.find((o) => o.id === orderId)

    ServiceOrders.update(orderId, {
      status: order_status.RENEWED
    })
    //   .then(console.log)
    //   .catch(console.error)
    const renewedOrder = {
      ...order,
      status: order_status.DELIVERED,
      deliveredAt: order.expireAt,
      renewedAt: new Date(),
      renewedFrom: orderId
    }

    delete renewedOrder.id
    delete renewedOrder.createdAt
    delete renewedOrder.updatedAt
    delete renewedOrder.scheduledAt
    delete renewedOrder.createdBy
    delete renewedOrder.updatedBy
    delete renewedOrder.comments
    delete renewedOrder.assignToPosition
    delete renewedOrder.assignToName
    delete renewedOrder.expireAt

    console.log({ renewedOrder })
    await ServiceOrders.create(renewedOrder)
      .then((res) => {
        if (res.ok)
          ServiceOrders.addComment({
            storeId,
            orderId,
            type: 'comment',
            content: 'Orden renovada '
          })
            .then(console.log)
            .catch(console.error)
      })
      .catch(console.error)
  }
  return (
    <Button
      disabled={disabled}
      label={'Renovar'}
      onPress={() => {
        handleRenew()
      }}
    />
  )
}
const ButtonDelivery = ({
  orderId,
  isDelivered,
  disabled,
  cancelPickup,
  isExpired
}: {
  orderId: string
  isDelivered?: boolean
  disabled?: boolean
  cancelPickup?: boolean
  isExpired?: boolean
}) => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const handleDelivery = () => {
    if (cancelPickup) {
      ServiceOrders.update(orderId, {
        status: isDelivered ? order_status.PICKUP : order_status.DELIVERED
      })
        .then(console.log)
        .catch(console.error)
    } else {
      ServiceOrders.update(orderId, {
        status: isDelivered ? order_status.PICKUP : order_status.DELIVERED,
        deliveredAt: new Date(),
        deliveredBy: user?.id
      })
        .then(console.log)
        .catch(console.error)
    }
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: isDelivered ? 'Orden recogida' : 'Orden entregada'
    })
      .then(console.log)
      .catch(console.error)
    // orderId,
    // 'comment',
    // isDelivered ? 'Orden recogida' : 'Orden entregada'
  }
  return (
    <Button
      disabled={disabled}
      label={
        cancelPickup
          ? 'Regresar'
          : isDelivered || isExpired
          ? 'Recoger'
          : 'Entregar'
      }
      onPress={() => {
        handleDelivery()
      }}
    />
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%' // spacing between items
  }
})

export default OrderActions
