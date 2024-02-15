import React from 'react'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'

export default function ScreenPayments({ navigation }) {
  const { payments } = useStore()
  return (
    <PaymentsList
      payments={payments}
      onPressRow={(paymentId) => {
        navigation.navigate('PaymentsDetails', { id: paymentId })
      }}
    />
  )
}
