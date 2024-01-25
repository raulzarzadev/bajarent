import { StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'

const OrderActions = ({ order }: { order: OrderType }) => {
  const navigation = useNavigation()
  return (
    <View style={{ padding: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <P size="lg" bold styles={{ marginRight: 2 }}>
          Status:{' '}
        </P>
        <OrderStatus status={orderStatus(order)} />
      </View>
      <P bold>Acciones de orden</P>
      <View style={styles.container}>
        <View style={styles.item}>
          <ButtonDelivery
            orderId={order.id}
            disabled={order.status === 'CANCELLED' || order.status === 'PICKUP'}
            isDelivered={order.status === 'DELIVERED'}
          />
        </View>
        <View style={styles.item}>
          <ButtonCancel
            orderId={order.id}
            disabled={order.status === 'DELIVERED' || order.status === 'PICKUP'}
            isCancelled={order.status === 'CANCELLED'}
          />
        </View>
        <View style={styles.item}>
          <ButtonAuthorize
            orderId={order.id}
            disabled={
              order.status === 'CANCELLED' ||
              order.status === 'DELIVERED' ||
              order.status === 'PICKUP'
            }
            isAuthorized={order.status === 'AUTHORIZED'}
          />
        </View>

        {/* <View style={styles.item}>
          <ButtonReport orderId={order.id} />
        </View> */}
        {/* <View style={styles.item}>
          <ButtonComment orderId={order.id} />
        </View> */}
        <View style={styles.item}>
          <Button
            onPress={() => {
              navigation.navigate('EditOrder', { orderId: order.id })
            }}
            label="Editar"
          />
        </View>

        {/* <View style={styles.item}>
          <Button label="Cancelar" />
        </View> */}
      </View>
    </View>
  )
}
const ButtonCancel = ({ orderId, isCancelled, disabled }) => {
  const handleCancel = () => {
    ServiceOrders.update(orderId, {
      status: isCancelled ? 'PENDING' : 'CANCELLED'
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment(
      orderId,
      'comment',
      isCancelled ? 'Orden reanudada' : 'Orden cancelada'
    )
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
    ServiceOrders.addComment(
      orderId,
      'comment',
      isAuthorized ? 'Orden no autorizada' : 'Orden autorizada'
    )
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
  const handleDelivery = () => {
    ServiceOrders.update(orderId, {
      status: isDelivered ? 'PICKUP' : 'DELIVERED'
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment(
      orderId,
      'comment',
      isDelivered ? 'Orden recogida' : 'Orden entregada'
    )
      .then(console.log)
      .catch(console.error)
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
