import { View } from 'react-native'
import React from 'react'
import Button from './Button'
import { gSpace, gStyles } from '../styles'

const ScreenCashbox = ({ navigation }) => {
  return (
    <View style={[{ maxWidth: 500, marginHorizontal: 'auto' }]}>
      <View>
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
            label="Cortes de caja"
            onPress={() => {
              navigation.navigate('Balances')
            }}
          ></Button>
        </View>
      </View>
    </View>
  )
}

export default ScreenCashbox
