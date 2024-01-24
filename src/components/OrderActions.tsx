import { StyleSheet, Text, View } from 'react-native'
import theme from '../theme'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useAuth } from '../contexts/authContext'
import OrderType from '../types/OrderType'
import StyledModal from './StyledModal'
import StyledTextInput from './StyledTextInput'
import useModal from '../hooks/useModal'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useState } from 'react'

const OrderActions = ({ order }: { order: OrderType }) => {
  const { user } = useAuth()
  const handleAction = (action: 'delivery') => () => {
    if (action === 'delivery') {
      ServiceOrders.update(order.id, {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        deliveredBy: user.id
      })
        .then(console.log)
        .catch(console.error)
    }
  }

  return (
    <View style={{ padding: theme.padding.md }}>
      <OrderStatus status={orderStatus(order)} />
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
        {/* <View style={styles.item}>
          <ButtonReport orderId={order.id} />
        </View> */}
        {/* <View style={styles.item}>
          <ButtonComment orderId={order.id} />
        </View> */}
        {/* <View style={styles.item}>
          <Button label="Editar" />
        </View> */}

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
        styles={{
          backgroundColor: isCancelled
            ? theme.statusColor.CANCELLED
            : theme.colors.error
        }}
        label={isCancelled ? 'Reanudar orden' : 'Cancelar orden'}
        onPress={() => {
          handleCancel()
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
      styles={{
        backgroundColor: isDelivered
          ? theme.colors.primary
          : theme.colors.secondary
      }}
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
