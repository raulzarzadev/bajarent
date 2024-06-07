import { ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaymentsList from './PaymentsList'
import { useStore } from '../contexts/storeContext'
import PaymentType from '../types/PaymentType'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ServicePayments } from '../firebase/ServicePayments'

export default function ScreenPayments({ navigation, route }) {
  const [payments, setPayments] = useState<PaymentType[]>([])
  const { storeId } = useStore()
  const { consolidatedOrders } = useOrdersCtx()
  const preList = route?.params?.payments || null
  const [count, setCount] = useState(10)
  const [fullPayments, setFullPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (storeId)
      ServicePayments.getLast(storeId, { count }).then((p) => {
        setPayments(p)
      })
  }, [count, storeId])

  useEffect(() => {
    if (preList) {
      const filteredPayments = payments.filter(({ id }) => preList.includes(id))
      setFullPayments(filteredPayments)
    } else {
      setFullPayments(payments)
    }
  }, [payments])
  const paymentsWithOrderData = fullPayments.map((p) => {
    const consolidateOrder = consolidatedOrders?.orders?.[p.orderId]
    return {
      ...p,
      orderFolio: consolidateOrder?.folio as number, //* This is the line that is causing the error
      orderName: consolidateOrder?.name as string,
      orderNote: consolidateOrder?.note as string
    }
  })
  return (
    <ScrollView>
      <PaymentsList
        payments={paymentsWithOrderData}
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}
        onFetchMore={() => {
          setCount((count) => count + 10)
          console.log('fetch more')
        }}
      />
    </ScrollView>
  )
}
