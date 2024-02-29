import { Linking, View } from 'react-native'
import P from './P'
import Button from './Button'
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 'auto'
      }}
    >
      <P size="lg">{formatPhoneNumber(phone)}</P>
      {phone && (
        <>
          <Button
            buttonStyles={{ marginHorizontal: 4 }}
            justIcon
            icon="phone"
            variant="ghost"
            color={'secondary'}
            onPress={() => {
              Linking.openURL(`tel:${phone}`)
            }}
          />
          <Button
            buttonStyles={{ marginHorizontal: 4 }}
            justIcon
            icon="whatsapp"
            variant="ghost"
            color={'success'}
            onPress={() => {
              Linking.openURL(`https://wa.me/${phone.replace('+', '')}`)
            }}
          />
        </>
      )}
    </View>
  )
}

export default CardPhone
