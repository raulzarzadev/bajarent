import { View } from 'react-native'
import React from 'react'
import Button from './Button'
import { gSpace, gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'

const ScreenCashbox = ({ navigation }) => {
  const { staffPermissions } = useStore()
  return (
    <View style={gStyles.container}>
      {staffPermissions?.isAdmin && (
        <>
          <View style={{ marginVertical: gSpace(2) }}>
            <Button
              label="Pagos"
              onPress={() => {
                navigation.navigate('Payments')
              }}
            ></Button>
          </View>
          <View style={{ marginVertical: gSpace(2) }}>
            <Button
              label="Balances"
              onPress={() => {
                navigation.navigate('Balances')
              }}
            ></Button>
          </View>
        </>
      )}
    </View>
  )
}

export default ScreenCashbox
