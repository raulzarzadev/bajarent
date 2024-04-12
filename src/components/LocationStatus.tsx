import { Text, View } from 'react-native'
import React from 'react'
import useLocation from '../hooks/useLocation'
import Icon from './Icon'
import theme from '../theme'
import Button from './Button'
import { gSpace, gStyles } from '../styles'

const LocationStatus = () => {
  const { locationEnabled } = useLocation()
  if (!locationEnabled) return null
  return (
    <View style={{ marginRight: 8 }}>
      {locationEnabled ? (
        <Icon icon="location" color={theme.primary} />
      ) : (
        <Icon icon="locationOff" color={theme.neutral} />
      )}
    </View>
  )
}

export const ButtonAskLocation = () => {
  const { locationEnabled, askLocation } = useLocation()

  return (
    <>
      <Button
        icon={locationEnabled ? 'location' : 'locationOff'}
        label={locationEnabled ? 'Ubicación activada' : 'Activar ubicación'}
        size="small"
        variant="ghost"
        buttonStyles={{ width: 220, margin: 'auto' }}
        onPress={() => {
          askLocation()
        }}
      ></Button>
      {!locationEnabled && (
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
