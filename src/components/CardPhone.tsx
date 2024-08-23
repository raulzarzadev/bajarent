import { Linking, View, ViewStyle } from 'react-native'
import P from './P'
import Button from './Button'
import StyledModal from './StyledModal'
import ModalSendWhatsapp from './ModalSendWhatsapp'

const CardPhone = ({ phone, style }: { phone: string; style?: ViewStyle }) => {
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
      style={[
        {
          flexDirection: 'row'
        },
        style
      ]}
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
          {/* <Button
            buttonStyles={{ marginHorizontal: 4 }}
            justIcon
            icon="whatsapp"
            variant="ghost"
            color={'success'}
            onPress={() => {
              Linking.openURL(`https://wa.me/${phone.replace('+', '')}`)
            }}
          /> */}
          <ModalSendWhatsapp justIcon />
        </>
      )}
    </View>
  )
}

export default CardPhone
