import { Text, View, Image, Linking, Pressable } from 'react-native'
import React from 'react'
import OrderType, { order_type } from '../types/OrderType'
import { Ionicons } from '@expo/vector-icons'
import P from './P'
import CardPhone from './CardPhone'
import theme from '../theme'
import { dateFormat, fromNow } from '../libs/utils-date'
import CurrencyAmount from './CurrencyAmount'
import OrderActions from './OrderActions'
import OrderComments from './OrderComments'
import dictionary from '../dictionary'
import Chip from './Chip'
import OrderStatus from './OrderStatus'
import useAssignOrder from '../hooks/useAssignOrder'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import OrderAssignedTo from './OrderAssignedTo'

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

      <OrderDirectives order={order} />
      <View
        style={{
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
      <ErrorBoundary componentName="ItemDetails">
        <ItemDetails order={order} />
      </ErrorBoundary>
      <ErrorBoundary componentName="OrderActions">
        <OrderActions order={order} />
      </ErrorBoundary>
      <ErrorBoundary componentName="OrderComments">
        <OrderComments orderId={order.id} />
      </ErrorBoundary>
    </View>
  )
}

const ItemDetails = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View
      style={{
        marginVertical: 16,
        paddingVertical: 16,
        backgroundColor: theme?.base
      }}
    >
      <Text style={[gStyles.h3, { marginBottom: 8 }]}>Artículo</Text>
      {order?.type === order_type.RENT && (
        <View>
          <View>
            <Text style={[gStyles.h3]}>{order?.item?.categoryName}</Text>
            <Text style={[gStyles.p, gStyles.tCenter]}>
              {order?.item?.priceSelected?.title}
            </Text>
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
                <Text style={[gStyles.p, gStyles.tCenter, gStyles.tBold]}>
                  Expira
                </Text>
                <Text style={[gStyles.p, gStyles.tCenter]}>
                  {dateFormat(order?.expireAt, 'dd/MM/yy HH:mm')}
                </Text>
                <Text style={[gStyles.p, gStyles.tCenter]}>
                  {fromNow(order?.expireAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      {order.type === order_type.REPAIR && (
        <View>
          <Text style={gStyles.h3}>Detalles de reparacion </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            {order?.item?.categoryName}
          </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.description}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemBrand}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemSerial}</Text>
        </View>
      )}
    </View>
  )
}

const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Chip
        title={dictionary(order.type)?.toUpperCase()}
        color={theme.primary}
        titleColor={theme.black}
      ></Chip>
      <OrderStatus orderId={order.id} style={{ width: '33%' }} />
      <OrderAssignedTo orderId={order.id} />
    </View>
  )
}

export default OrderDetails
