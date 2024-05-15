import { Linking } from 'react-native'
import Button from './Button'

const LinkLocation = ({ location }: { location: string }) => {
  return (
    <Button
      icon={location ? 'location' : 'locationOff'}
      disabled={!location}
      onPress={() => {
        console.log({ location })
        if (location.startsWith('http')) {
          return Linking.openURL(location)
        }
        return Linking.openURL(`https://www.google.com/maps?q=${location}`)
      }}
      variant="ghost"
      justIcon
    />
  )
}

export default LinkLocation
