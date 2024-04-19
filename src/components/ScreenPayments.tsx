import { ScrollView, View } from 'react-native'
import React from 'react'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'

export default function ScreenPayments({ navigation }) {
  const { payments } = useStore()
  return (
    <ScrollView>
      <PaymentsList
        payments={payments}
        onPressRow={(paymentId) => {
          navigation.navigate('PaymentsDetails', { id: paymentId })
        }}
      />
    </ScrollView>
  )
}
