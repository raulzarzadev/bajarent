import { View, Text, ScrollView, Pressable, Linking } from 'react-native'

import { dateFormat, fromNow } from '../libs/utils-date'
import P from './P'
import OrderActions from './OrderActions'

import OrderComments from './OrderComments'
import Ionicons from '@expo/vector-icons/Ionicons'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route.params
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)

  if (order === undefined) return <Text>Cargando...</Text>
  if (order === null) return <Text>Orden no encontrada</Text>

  return (
    <ScrollView style={{ marginVertical: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <P size="sm">
          {` ${dateFormat(order.createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(
            order.createdAt
          )} `}
        </P>
        <P size="sm"> {order.id}</P>
      </View>

      <View
        style={{
          marginTop: 32,
          padding: 4
        }}
      >
        <P size="lg" bold styles={{ textAlign: 'center' }}>
          {order.firstName} {order.lastName}
        </P>
        <PhoneCard phone={order.phone} />
      </View>
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
              const areCoordinates = !isNaN(Number(lat)) && !isNaN(Number(lon))
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
      <OrderActions order={order} />
      <OrderComments orderId={orderId} />
    </ScrollView>
  )
}

const PhoneCard = ({ phone }) => {
  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters from the phone number
    const cleanedPhoneNumber = phone.replace(/\D/g, '')

    // Format the phone number with dashes
    const formattedPhoneNumber = cleanedPhoneNumber.replace(
      /(\d{2})(\d{2})(\d{4})(\d{4})/,
      '($1) $2 $3 $4'
    )

    return formattedPhoneNumber
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <P size="lg">{formatPhoneNumber(phone)}</P>
      <Pressable
        style={{ marginHorizontal: 16 }}
        onPress={() => {
          Linking.openURL(`tel:${phone}`)
        }}
      >
        <Ionicons name="call" size={24} color={theme.secondary} />
      </Pressable>
      <Pressable
        style={{ marginHorizontal: 16 }}
        onPress={() => {
          Linking.openURL(`https://wa.me/${phone.replace('+', '')}`)
        }}
      >
        <Ionicons name="logo-whatsapp" size={24} color={theme.success} />
      </Pressable>
    </View>
  )
}

export default ScreenOrderDetail
