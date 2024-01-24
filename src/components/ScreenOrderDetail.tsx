import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import P from './P'
import theme from '../theme'
import OrderActions from './OrderActions'

import OrderComments from './OrderComments'
import { ServiceComments } from '../firebase/ServiceComments'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route.params
  const [order, setOrder] = useState<OrderType | null | undefined>()
  const [comments, setComments] = useState<OrderType['comments']>([])
  useEffect(() => {
    ServiceOrders.listen(orderId, setOrder)
    ServiceComments.orderComments(orderId, setComments)
  }, [orderId])

  if (order === undefined) return <Text>Cargando...</Text>
  if (order === null) return <Text>Orden no encontrada</Text>

  return (
    <ScrollView style={{ marginVertical: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <P size="xs">{fromNow(order.createdAt)}</P>
        <P size="xs"> {order.id}</P>
      </View>

      <View
        style={{
          marginTop: 32,
          padding: theme.padding.sm
        }}
      >
        <P size="lg" bold styles={{ textAlign: 'left' }}>
          {order.firstName}
        </P>
        <P styles={{ textAlign: 'left', marginTop: theme.margin.sm }}>
          {order.phone}
        </P>
      </View>
      <OrderActions order={{ ...order, comments }} />
      <OrderComments orderId={orderId} />
    </ScrollView>
  )
}

export default ScreenOrderDetail
