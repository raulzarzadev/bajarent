import { ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ListPayments from './ListPayments'
import { usePayments } from '../contexts/paymentsContext'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ServicePayments } from '../firebase/ServicePayments'
import {
  ConsolidatedOrderType,
  ConsolidatedStoreOrdersType
} from '../firebase/ServiceConsolidatedOrders'
import PaymentType from '../types/PaymentType'

export default function ScreenPayments({ navigation, route }) {
  const preList = route?.params?.payments || null
  const { consolidatedOrders } = useOrdersCtx()
  const { storeId } = useStore()
  const [payments, setPayments] = useState([])
  console.log('pasa')
  useEffect(() => {
    handleGetPayments()
  }, [consolidatedOrders])
  const handleGetPayments = () => {
    if (preList?.length) {
      ServicePayments.list(preList).then((res) =>
        setPayments(
          formatPaymentWithOrder({
            payments: res,
            orders: consolidatedOrders.orders
          })
        )
      )
    } else {
      ServicePayments.getLast(storeId, { days: 1 }).then((res) =>
        setPayments(
          formatPaymentWithOrder({
            payments: res,
            orders: consolidatedOrders.orders
          })
        )
      )
    }
  }
  return (
    <ScrollView>
      <ListPayments
        payments={payments}
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}
        onRefresh={async () => {
          handleGetPayments()
        }}
      />
    </ScrollView>
  )
}

export const formatPaymentWithOrder = ({
  payments,
  orders
}: {
  payments: PaymentType[]
  orders: ConsolidatedStoreOrdersType['orders']
}): (PaymentType & {
  orderFolio: number
  orderName: string
  orderNote: string
})[] => {
  const paymentWithOrderData = payments?.map((p) => {
    const consolidateOrder = orders[p.orderId]
    return {
      ...p,
      orderFolio: consolidateOrder?.folio ?? 0, // Usar ?? para proporcionar un valor predeterminado
      orderName: consolidateOrder?.fullName ?? '', // Usar ?? para proporcionar un valor predeterminado
      orderNote: consolidateOrder?.note ?? '' // Usar ?? para proporcionar un valor predeterminado
    }
  })
  return paymentWithOrderData
}
