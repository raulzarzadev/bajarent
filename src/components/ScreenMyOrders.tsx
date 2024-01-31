import { StyleSheet, View } from 'react-native'
import Button from './Button'

import { useStore } from '../contexts/storeContext'
import OrdersList from './OrdersList'

function ScreenMyOrders({ navigation }) {
  const { myOrders } = useStore()
  console.log({ myOrders })
  return (
    <>
      <View
        style={{
          padding: 4,
          width: 150,
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        <Button onPress={() => navigation.push('NewOrder')}>Nueva orden</Button>
      </View>
      <OrdersList
        orders={myOrders}
        onPressRow={(itemId) => {
          navigation.navigate('OrderDetails', { orderId: itemId })
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 12,

    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
})

export default ScreenMyOrders
