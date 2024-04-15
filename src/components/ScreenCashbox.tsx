import { Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { gSpace, gStyles } from '../styles'
import { useEmployee } from '../contexts/employeeContext'

const ScreenCashbox = ({ navigation }) => {
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()

  const canViewCashbox = isAdmin || isOwner

  return (
    <View style={[{ maxWidth: 500, marginHorizontal: 'auto' }]}>
      {!canViewCashbox && (
        <Text style={[gStyles.helper, { textAlign: 'center' }]}>
          Permisios insuficientes
        </Text>
      )}
      {canViewCashbox && (
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
      )}
    </View>
  )
}

export default ScreenCashbox
