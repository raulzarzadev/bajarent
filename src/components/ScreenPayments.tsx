import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'
import PaymentType from '../types/PaymentType'

export default function ScreenPayments({ navigation, route }) {
  const { payments } = useStore()
  const preList = route?.params?.payments || null
  console.log({ preList })
  const [fullPayments, setFullPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (preList) {
      const filteredPayments = payments.filter(({ id }) => preList.includes(id))
      setFullPayments(filteredPayments)
    } else {
      setFullPayments(payments)
    }
  }, [payments])

  return (
    <ScrollView>
      <PaymentsList
        payments={fullPayments}
        onPressRow={(paymentId) => {
          navigation.navigate('PaymentsDetails', { id: paymentId })
        }}
      />
    </ScrollView>
  )
}
