import { Text, View } from 'react-native'
import React from 'react'
import useLocation from '../hooks/useLocation'
import Icon from './Icon'
import theme from '../theme'
import Button from './Button'
import { gSpace, gStyles } from '../styles'

const LocationStatus = () => {
  const { location } = useLocation()
  if (!location) return null
  return (
    <View style={{ marginRight: 8 }}>
      {location ? (
        <Icon icon="location" color={theme.primary} />
      ) : (
        <Icon icon="locationOff" color={theme.neutral} />
      )}
    </View>
  )
}

export const ButtonAskLocation = () => {
  const { location, getLocation } = useLocation()

  return (
    <>
      <Button
        icon={location ? 'location' : 'locationOff'}
        label={location ? 'Ubicación activada' : 'Activar ubicación'}
        size="small"
        variant="ghost"
        buttonStyles={{ width: 220, margin: 'auto' }}
        onPress={() => {
          getLocation()
        }}
      ></Button>
      {!location && (
        <Text
          style={[
            gStyles.helper,
            { textAlign: 'center', marginBottom: gSpace(3) }
          ]}
        >
          INFO: Te permitra acceder a la ubicación GPS a la hora de generar una
          orden y poder guardarla de forma mas rapida.
        </Text>
      )}
    </>
  )
}

export default LocationStatus
