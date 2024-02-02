import { View } from 'react-native'
import Button from './Button'

import { useStore } from '../contexts/storeContext'
import OrdersList from './OrdersList'

function ScreenOrders({ navigation }) {
  const { orders, staffPermissions } = useStore()
  const canCreateOrder =
    staffPermissions?.canCreateOrder || staffPermissions.isAdmin
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
        {!!canCreateOrder && (
          <Button onPress={() => navigation.push('NewOrder')}>
            Nueva orden
          </Button>
        )}
      </View>
      <OrdersList
        orders={orders}
        onPressRow={(itemId) => {
          navigation.navigate('OrderDetails', { orderId: itemId })
        }}
      />
    </>
  )
}

export default ScreenOrders
