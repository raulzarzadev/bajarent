import { View } from 'react-native'
import React from 'react'
import Button from './Button'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'

const ScreenCashbox = ({ navigation }) => {
  const { staffPermissions } = useStore()
  return (
    <View style={gStyles.container}>
      {staffPermissions?.isAdmin && (
        <Button
          label="Pagos"
          onPress={() => {
            navigation.navigate('Payments')
          }}
        ></Button>
      )}
    </View>
  )
}

export default ScreenCashbox
