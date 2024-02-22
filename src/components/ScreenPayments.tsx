import { View } from 'react-native'
import React from 'react'
import { gStyles } from '../styles'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'

export default function ScreenPayments({ navigation }) {
  const { payments } = useStore()
  return (
    <View style={gStyles.container}>
      <PaymentsList
        payments={payments}
        onPressRow={(paymentId) => {
          navigation.navigate('PaymentsDetails', { id: paymentId })
        }}
      />
    </View>
  )
}