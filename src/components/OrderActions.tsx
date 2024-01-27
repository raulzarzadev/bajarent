import { StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'

const OrderActions = ({ order }: { order: OrderType }) => {
  const navigation = useNavigation()
  const status = orderStatus(order)

  const disabledDeliveryButton: boolean = [
    'CANCELLED',
    'PICKUP',
    'PENDING'
  ].includes(status)

  const disabledCancelButton: boolean = ['DELIVERED', 'PICKUP'].includes(status)

  const disabledAuthorizeButton: boolean = [
    'CANCELLED',
    'DELIVERED',
    'PICKUP'
  ].includes(status)

  const disabledEditButton: boolean = ['PICKUP', 'CANCELLED'].includes(status)

  const disabledAssignButton: boolean = ['PICKUP', 'CANCELLED'].includes(status)

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
        <OrderStatus orderId={order.id} />
      </View>
      <P bold>Acciones de orden</P>
      <View style={styles.container}>
        <View style={styles.item}>
          <ButtonDelivery
            orderId={order.id}
            disabled={disabledDeliveryButton}
            isDelivered={status === 'DELIVERED'}
          />
        </View>
        <View style={styles.item}>
          <ButtonCancel
            orderId={order.id}
            disabled={disabledCancelButton}
            isCancelled={status === 'CANCELLED'}
          />
        </View>
        <View style={styles.item}>
          <ButtonAuthorize
            orderId={order.id}
            disabled={disabledAuthorizeButton}
            isAuthorized={status === 'AUTHORIZED'}
          />
        </View>

        <View style={styles.item}>
          <Button
            disabled={disabledEditButton}
            onPress={() => {
              navigation.navigate('EditOrder', { orderId: order.id })
            }}
            label="Editar"
          />
        </View>

        <View style={styles.item}>
          <Button
            disabled={disabledAssignButton}
            onPress={() => {
              navigation.navigate('AssignOrder', { orderId: order.id })
            }}
            label="Asignar"
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
      status: isCancelled ? 'PENDING' : 'CANCELLED'
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
  const handleAuthorize = () => {
    ServiceOrders.update(orderId, {
      status: isAuthorized ? 'PENDING' : 'AUTHORIZED'
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
      status: isDelivered ? 'PICKUP' : 'DELIVERED'
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
