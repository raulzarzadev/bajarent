import { ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ListPayments from './ListPayments'
import { useStore } from '../contexts/storeContext'
import PaymentType from '../types/PaymentType'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ServicePayments } from '../firebase/ServicePayments'
import { gStyles } from '../styles'

const COUNT_DAYS = 2
export default function ScreenPayments({ navigation, route }) {
  const [payments, setPayments] = useState<PaymentType[]>([])
  const { storeId } = useStore()
  const { consolidatedOrders } = useOrdersCtx()
  const preList = route?.params?.payments || null
  const [count, setCount] = useState(10)
  const [days, setDays] = useState(COUNT_DAYS)
  const [fullPayments, setFullPayments] = useState<PaymentType[]>([])
  useEffect(() => {
    if (storeId)
      ServicePayments.getLast(storeId, { count, days }).then((p) => {
        console.log({ p })
        setPayments(p)
      })
  }, [count, storeId, days])

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
      orderName: consolidateOrder?.fullName as string,
      orderNote: consolidateOrder?.note as string
    }
  })
  return (
    <ScrollView>
      <Text style={gStyles.h2}>Ultimos {days} días</Text>
      <ListPayments
        payments={paymentsWithOrderData}
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}
        onFetchMore={() => {
          setDays((count) => count + COUNT_DAYS)
        }}
        onFetchMoreCount={`${COUNT_DAYS} días`}
      />
    </ScrollView>
  )
}
