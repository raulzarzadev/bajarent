import { View, Text, ScrollView, Pressable, Linking, Image } from 'react-native'

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
  const { orderId } = route.params
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)

  if (order === undefined) return <Text>Cargando...</Text>
  if (order === null) return <Text>Orden no encontrada</Text>

  console.log({ order })
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <P size="sm">
            {` ${dateFormat(order.createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(
              order.createdAt
            )} `}
          </P>
          <Text style={{ textAlign: 'center' }}>
            <P bold size="lg">
              Folio:{' '}
            </P>
            <P size="lg">{order?.folio}</P>
          </Text>
          <P size="sm"> {order.id}</P>
        </View>
        <View
          style={{
            // marginTop: 32,
            padding: 4
          }}
        >
          <P size="lg" bold styles={{ textAlign: 'center' }}>
            {order.firstName} {order.lastName}
          </P>
        </View>
        <View>
          {order.imageID && (
            <Image
              source={{ uri: order.imageID }}
              style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
            />
          )}
          {order.imageID && (
            <Image
              source={{ uri: order.imageHouse }}
              style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
            />
          )}
        </View>
        <CardPhone phone={order.phone} />

        <View style={{ alignItems: 'center' }}>
          {order.scheduledAt && (
            <P size="lg" styles={{ textAlign: 'center' }}>
              {`  ${dateFormat(order.scheduledAt, 'dd/MMM/yy')} ${fromNow(
                order.scheduledAt
              )} `}
              <Ionicons
                style={{ marginLeft: 6, opacity: 0.5 }}
                name="calendar"
                size={24}
                color="gray"
              />
            </P>
          )}
        </View>
        <View>
          {order.location && (
            <Pressable
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              onPress={() => {
                const isUrl = /^https?:\/\/\S+$/.test(order.location)
                if (isUrl) return Linking.openURL(order.location)

                const [lat, lon] = order.location.split(',')
                const areCoordinates =
                  !isNaN(Number(lat)) && !isNaN(Number(lon))
                if (areCoordinates)
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
                  )

                alert('No se puede abrir la ubicación')
              }}
            >
              <P>{`Ubicación`} </P>
              <Ionicons name="location" size={24} color={theme.secondary} />
            </Pressable>
          )}
        </View>
        <View>
          <P bold size="xl">
            Articulo
          </P>
          <View
            style={{
              marginVertical: 16,
              paddingVertical: 16,
              backgroundColor: theme.base
            }}
          >
            <P>{order?.item?.categoryName}</P>
            <P>{order?.item?.priceSelected.title}</P>
            <CurrencyAmount
              style={{
                alignContent: 'center',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
              amount={order?.item?.priceSelected?.amount}
            />
          </View>
        </View>
        <OrderActions order={order} />
        <OrderComments orderId={orderId} />
      </View>
    </ScrollView>
  )
}

export default ScreenOrderDetail
