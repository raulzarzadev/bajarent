import { Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { gSpace, gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'

const ScreenCashbox = ({ navigation }) => {
  const { user } = useAuth()
  const { staffPermissions, store } = useStore()
  const isOwner = user.id === store.createdBy
  const canViewCashbox = staffPermissions?.isAdmin || isOwner
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
