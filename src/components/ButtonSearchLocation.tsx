import { View, Linking } from 'react-native'
import React from 'react'
import Icon from './Icon'
import theme from '../theme'
import Button from './Button'

export type Coordinates = `${number},${number},${number}`

const ButtonSearchLocation = ({
  location
}: // setLocation
{
  location?: Coordinates | string
  // seLocation?: (coordinates: Coordinates) => void
}) => {
  const disabledCurrentLocation = false
  const areCoordinates = /^-?\d+\.\d+,-?\d+\.\d+(,-?\d+(\.\d+)?)?$/.test(
    location
  )

  const [lat, lent] = location.split(',')

  const isUrl = /^https?:\/\/\S+$/.test(location)
  const urlMaps = 'https://www.google.com/maps/search/'
  const urlCoordinates = `${urlMaps}?api=1&query=${lat},${lent}`
  const urlAddress = `${urlMaps}?api=1&query=${encodeURIComponent(location)}`
  return (
    <Button
      variant="ghost"
      // style={[styles.icon, disabledCurrentLocation && { opacity: 0.5 }]}
      disabled={disabledCurrentLocation}
      onPress={() => {
        if (isUrl) return Linking.openURL(location)
        if (areCoordinates) return Linking.openURL(urlCoordinates)

        return Linking.openURL(urlAddress)
      }}
    >
      <Icon
        // disabled={true}
        icon={'map'}
        color={theme.secondary}
        // color={disabledCurrentLocation ? 'gray' : theme.secondary}
        //  size={30}
      />
    </Button>
  )
}

export default ButtonSearchLocation
