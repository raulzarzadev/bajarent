import { Linking, Pressable, View } from 'react-native'
import P from './P'
import Ionicons from '@expo/vector-icons/Ionicons'

import theme from '../theme'
const CardPhone = ({ phone }) => {
  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters from the phone number
    const cleanedPhoneNumber = phone?.replace(/\D/g, '')

    // Format the phone number with dashes
    const formattedPhoneNumber = cleanedPhoneNumber.replace(
      /(\d{2})(\d{2})(\d{4})(\d{4})/,
      '($1) $2 $3 $4'
    )

    return formattedPhoneNumber
  }

  if (!phone || phone === 'undefined') return null

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <P size="lg">{formatPhoneNumber(phone)}</P>
      {phone && (
        <>
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
        </>
      )}
    </View>
  )
}

export default CardPhone
