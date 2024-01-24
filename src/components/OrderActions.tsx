import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
          <Button
            disabled={order.status === 'DELIVERED'}
            label="Entregar"
            onPress={handleAction('delivery')}
          />
        </View>
        <View style={styles.item}>
          <ButtonReport orderId={order.id} />
        </View>
        <View style={styles.item}>
          <ButtonComment orderId={order.id} />
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
const ButtonComment = ({ orderId }) => {
  const modal = useModal({ title: 'Comentar' })
  const [value, setValue] = React.useState('')
  const handleComment = () => {
    ServiceOrders.addComment(orderId, 'comment', value)
      .then(console.log)
      .catch(console.error)
  }
  return (
    <>
      <StyledModal {...modal}>
        <View>
          <StyledTextInput
            onChangeText={(e) => {
              setValue(e)
            }}
            value={value}
            placeholder="Comentario"
          ></StyledTextInput>
          <Button
            onPress={() => {
              handleComment()
            }}
            styles={{ borderColor: theme.colors.error }}
          >
            Comentar
          </Button>
        </View>
      </StyledModal>
      <Button
        label="Comentar"
        onPress={() => {
          modal.toggleOpen()
        }}
      />
    </>
  )
}
const ButtonReport = ({ orderId }) => {
  const modal = useModal({ title: 'Reportar' })
  const [value, setValue] = React.useState('')
  const handleReport = () => {
    ServiceOrders.report(orderId, value).then(console.log).catch(console.error)
  }
  return (
    <>
      <StyledModal {...modal}>
        <View>
          <StyledTextInput
            onChangeText={(e) => {
              setValue(e)
            }}
            value={value}
            placeholder="Describa el problema"
          ></StyledTextInput>
          <Button
            onPress={() => {
              handleReport()
            }}
            styles={{ borderColor: theme.colors.error }}
          >
            Reportar
          </Button>
        </View>
      </StyledModal>
      <Button
        label="Reportar"
        onPress={() => {
          modal.toggleOpen()
        }}
      />
    </>
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
