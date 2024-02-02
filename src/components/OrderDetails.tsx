import { Text, View, Image, Linking, Pressable } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { Ionicons } from '@expo/vector-icons'
import P from './P'
import CardPhone from './CardPhone'
import theme from '../theme'
import { dateFormat, fromNow } from '../libs/utils-date'
import CurrencyAmount from './CurrencyAmount'
import OrderActions from './OrderActions'
import OrderComments from './OrderComments'
import H1 from './H1'

const OrderDetails = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <P size="sm">
          {` ${dateFormat(order?.createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(
            order?.createdAt
          )} `}
        </P>
        <Text style={{ textAlign: 'center' }}>
          <P bold size="lg">
            Folio:{' '}
          </P>
          <P size="lg">{order?.folio}</P>
        </Text>
        <P size="sm"> {order?.id}</P>
      </View>
      <View
        style={{
          // marginTop: 32,
          padding: 4
        }}
      >
        <P size="lg" bold styles={{ textAlign: 'center' }}>
          {order?.firstName} {order?.lastName}
        </P>
      </View>
      <View>
        {order?.imageID && (
          <Image
            source={{ uri: order?.imageID }}
            style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
          />
        )}
        {order?.imageID && (
          <Image
            source={{ uri: order?.imageHouse }}
            style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
          />
        )}
      </View>
      <CardPhone phone={order?.phone} />

      <View style={{ alignItems: 'center' }}>
        {order?.scheduledAt && (
          <P size="lg" styles={{ textAlign: 'center' }}>
            {`  ${dateFormat(order?.scheduledAt, 'dd/MMM/yy')} ${fromNow(
              order?.scheduledAt
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
        {order?.location && (
          <Pressable
            style={{ flexDirection: 'row', justifyContent: 'center' }}
            onPress={() => {
              const isUrl = /^https?:\/\/\S+$/.test(order?.location)
              if (isUrl) return Linking.openURL(order?.location)

              const [lat, lon] = order?.location?.split(',') ?? []
              const areCoordinates = !isNaN(Number(lat)) && !isNaN(Number(lon))
              if (areCoordinates)
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
                )

              alert('No se puede abrir la ubicación')
            }}
          >
            <P>{`Ubicación`} </P>
            <Ionicons name="location" size={24} color={theme?.secondary} />
          </Pressable>
        )}
      </View>
      <View>
        <Text style={{ textAlign: 'center' }}>{order?.street}</Text>
        <Text style={{ textAlign: 'center' }}>{order?.betweenStreets}</Text>
        <Text style={{ textAlign: 'center' }}>{order?.neighborhood}</Text>
      </View>
      <View>
        <H1>Detalles de reparacion </H1>
        <Text>{order?.item.categoryName}</Text>
        <Text>{order?.description}</Text>
        <Text>{order?.itemBrand}</Text>
        <Text>{order?.itemSerial}</Text>
      </View>
      <View>
        <P bold size="xl">
          Articulo
        </P>
        <View
          style={{
            marginVertical: 16,
            paddingVertical: 16,
            backgroundColor: theme?.base
          }}
        >
          <P>{order?.item?.categoryName}</P>
          <P>{order?.item?.priceSelected?.title}</P>
          <CurrencyAmount
            style={{
              alignContent: 'center',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
            amount={order?.item?.priceSelected?.amount}
          />
          {order?.expireAt && (
            <View style={{ marginTop: 12 }}>
              <P bold styles={{ marginBottom: 0 }}>
                Expira{' '}
              </P>
              <P styles={{ marginBottom: 0 }}>
                {dateFormat(order?.expireAt, 'dd/MM/yy HH:mm')}
              </P>
              <P>{fromNow(order?.expireAt)}</P>
            </View>
          )}
        </View>
      </View>
      <View>
        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Asignada a:{' '}
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
          {order?.assignToPosition || 'No asignada'}
        </Text>
      </View>
      <OrderActions order={order} />
      <OrderComments orderId={order.id} />
    </View>
  )
}

export default OrderDetails
