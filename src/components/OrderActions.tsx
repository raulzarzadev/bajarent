import { StyleSheet, View } from 'react-native'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'

const OrderActions = ({ order }: { order: Partial<OrderType> }) => {
  const navigation = useNavigation()
  const status = orderStatus(order)
  const { staff } = useStore()
  const orderId = order?.id || ''

  const disabledDeliveryButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.PENDING
  ].includes(status)

  const disabledCancelButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP
  ].includes(status)

  const disabledAuthorizeButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP,
    order_status.DELIVERED
  ].includes(status)

  const disabledEditButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP
  ].includes(status)

  const disabledAssignButton: boolean = [
    order_status.CANCELLED,
    order_status.PICKUP
  ].includes(status)

  const assignedTo = staff?.find((s) => s?.id === order?.assignTo)
  const assignedName = assignedTo?.name || assignedTo?.position

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
        <View style={styles.item}>
          <ButtonDelivery
            orderId={orderId}
            disabled={disabledDeliveryButton}
            isDelivered={status === order_status.DELIVERED}
          />
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
              assignedName ? `Asignado a: ${assignedName}` : 'Asignar'
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
const ButtonDelivery = ({ orderId, isDelivered, disabled }) => {
  const { storeId } = useStore()
  const handleDelivery = () => {
    ServiceOrders.update(orderId, {
      status: isDelivered ? order_status.PICKUP : order_status.DELIVERED
    })
      .then(console.log)
      .catch(console.error)
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
      label={isDelivered ? 'Recoger' : 'Entregar'}
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
