import { View, Text, ScrollView, Pressable, Linking, Image } from 'react-native'
import OrderDetails from './OrderDetails'
import { dateFormat, fromNow } from '../libs/utils-date'
import P from './P'
import OrderActions from './OrderActions'

import OrderComments from './OrderComments'
import Ionicons from '@expo/vector-icons/Ionicons'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import CardPhone from './CardPhone'
import CurrencyAmount from './CurrencyAmount'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route?.params
  const { orders } = useStore()
  const order = orders?.find((order) => order?.id === orderId)

  if (order === undefined) return <Text>Cargando...</Text>
  if (order === null) return <Text>Orden no encontrada</Text>

  return (
    <ScrollView style={{}}>
      <View
        style={{
          maxWidth: 500,
          width: '100%',
          marginHorizontal: 'auto',
          marginTop: 12
        }}
      >
        <OrderDetails order={order} />
      </View>
    </ScrollView>
  )
}

export default ScreenOrderDetail
