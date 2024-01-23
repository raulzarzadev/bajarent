import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import P from './P'
import theme from './theme'
import OrderActions from './OrderActions'
import dictionary from '../dictionary'
import statusColors from '../libs/statusColor'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route.params
  const [order, setOrder] = useState<OrderType | null | undefined>()
  useEffect(() => {
    ServiceOrders.listen(orderId, setOrder)
  }, [orderId])

  if (order === undefined) return <Text>Cargando...</Text>
  if (order === null) return <Text>Orden no encontrada</Text>
  console.log({ order })
  return (
    <View style={{ marginVertical: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <P size="xs">{fromNow(order.createdAt)}</P>
        <P size="xs"> {order.id}</P>
      </View>
      <OrderStatus status={order.status} />
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
      <OrderActions order={order} />
    </View>
  )
}

const OrderStatus = ({ status }: { status: OrderType['status'] }) => {
  return (
    <View
      style={{
        padding: theme.padding.sm,
        backgroundColor: statusColors[status || 'PENDING'],
        borderRadius: theme.borderRadius.sm,
        marginVertical: theme.margin.md
      }}
    >
      <P>{dictionary(status || 'PENDING')}</P>
    </View>
  )
}

export default ScreenOrderDetail
