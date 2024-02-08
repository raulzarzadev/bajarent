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
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import OrderAssignedTo from './OrderAssignedTo'
import ClientName from './ClientName'
import ButtonSearchLocation from './ButtonSearchLocation'

const OrderDetails = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View>
      <OrderMetadata order={order} />

      <OrderDirectives order={order} />
      <View
        style={{
          padding: 4
        }}
      >
        <ClientName order={order} style={gStyles.h1} />
      </View>
      <CardPhone phone={order?.phone} />
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
        <OrderAddress order={order} />
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

const OrderAddress = ({ order }: { order: Partial<OrderType> }) => {
  const neighborhood = order?.neighborhood || ('' && `${order?.neighborhood}`)
  const street = order?.street || ''
  const betweenStreets = order?.betweenStreets || ''
  const address = order.address || ''

  const location = order?.location || ''

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View style={{ marginRight: 8 }}>
        <Text style={[gStyles.tCenter, gStyles.tBold]}>{neighborhood}</Text>
        <Text style={[gStyles.tCenter]}>{street}</Text>
        <Text style={[gStyles.tCenter]}>{betweenStreets}</Text>
        <Text style={[gStyles.tCenter]}>{address}</Text>
      </View>
      <ButtonSearchLocation location={location} />
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
          <Text style={[gStyles.p, gStyles.tCenter]}>
            {order?.item?.categoryName}
          </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.description}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemBrand}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemSerial}</Text>

          <Text style={gStyles.h3}>Detalles de reparación </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.repairInfo}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            <CurrencyAmount style={gStyles.tBold} amount={order?.repairTotal} />
          </Text>
        </View>
      )}
    </View>
  )
}

export const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Chip
        style={{ width: 95 }}
        title={dictionary(order.type)?.toUpperCase()}
        color={theme.info}
        titleColor={theme.black}
      ></Chip>
      <OrderStatus orderId={order.id} />
      <OrderAssignedTo orderId={order.id} />
    </View>
  )
}

export const OrderMetadata = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 8
      }}
    >
      <View>
        <Text style={gStyles.helper}>
          {` ${dateFormat(order?.createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(
            order?.createdAt
          )} `}
        </Text>
        <Text style={gStyles.helper}> {order?.id}</Text>
      </View>
      <Text style={{ textAlign: 'center' }}>
        <P bold size="lg">
          Folio:{' '}
        </P>
        <P size="lg">{order?.folio}</P>
      </Text>
    </View>
  )
}

export default OrderDetails
