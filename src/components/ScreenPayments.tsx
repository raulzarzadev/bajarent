import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'
import PaymentType from '../types/PaymentType'
import useOrders from '../hooks/useOrders'
import { useOrdersCtx } from '../contexts/ordersContext'

export default function ScreenPayments({ navigation, route }) {
  const { payments } = useStore()
  const { consolidatedOrders } = useOrdersCtx()
  console.log({ consolidatedOrders })
  const preList = route?.params?.payments || null

  const [fullPayments, setFullPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (preList) {
      const filteredPayments = payments.filter(({ id }) => preList.includes(id))
      setFullPayments(filteredPayments)
    } else {
      setFullPayments(payments)
    }
  }, [payments])
  const paymentsWithOrderData = fullPayments.map((p) => ({
    ...p,
    orderFolio: consolidatedOrders.orders?.[p.orderId]?.folio as number //* This is the line that is causing the error
  }))
  console.log({ paymentsWithOrderData })
  return (
    <ScrollView>
      <PaymentsList
        payments={paymentsWithOrderData}
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}
      />
    </ScrollView>
  )
}
