import { View } from 'react-native'
import React from 'react'
import useLocation from '../hooks/useLocation'
import Icon from './Icon'
import theme from '../theme'

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

export default LocationStatus
