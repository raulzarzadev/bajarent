import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import theme from './theme'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useAuth } from '../contexts/authContext'
import OrderType from '../types/OrderType'

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
      <P bold>Acciones de orden</P>
      <View style={styles.container}>
        <View style={styles.item}>
          <Button
            disabled={order.status === 'DELIVERED'}
            label="Entregar"
            onPress={handleAction('delivery')}
          />
        </View>
        <View style={styles.item}>
          <Button label="No encontrado" />
        </View>
        <View style={styles.item}>
          <Button label="Comentar" />
        </View>
        <View style={styles.item}>
          <Button label="Editar" />
        </View>
        <View style={styles.item}>
          <Button label="Eliminar" />
        </View>
        <View style={styles.item}>
          <Button label="Cancelar" />
        </View>
      </View>
    </View>
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
