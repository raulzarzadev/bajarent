import { ScrollView, Text } from 'react-native'
import React, { useEffect } from 'react'
import ListPayments from './ListPayments'
import { usePayments } from '../contexts/paymentsContext'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'

export default function ScreenPayments({ navigation, route }) {
  const preList = route?.params?.payments || null
  const { consolidatedOrders } = useOrdersCtx()

  useEffect(() => {
    if (preList?.length) {
      handleSetPayments({ list: preList })
    } else {
      handleSetPayments({ days: 1 })
    }
  }, [consolidatedOrders, preList])

  return (
    <ScrollView>
      <ListPayments
        payments={payments}
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}

        // onRefresh={async () => {
        //   return await handleGetPayments()
        // }}
      />
    </ScrollView>
  )
}
