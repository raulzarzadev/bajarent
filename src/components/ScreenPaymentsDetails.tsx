import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import DateCell from './DateCell'
import { gStyles } from '../styles'

const ScreenPaymentsDetails = ({ route }) => {
  const { id } = route.params
  const { payments, orders } = useStore()
  const payment = payments.find((p) => p.id === id)
  const order = orders.find((o) => o.id === payment.orderId)
  return (
    <View style={gStyles.container}>
      {order?.fullName && <Text style={gStyles.h3}>{order.fullName}</Text>}
      {order?.type && <Text style={{ textAlign: 'center' }}>{order.type}</Text>}
      {order?.status && (
        <Text style={{ textAlign: 'center' }}>{order?.status}</Text>
      )}

      {payment?.date && (
        <Text style={{ textAlign: 'center' }}>
          <DateCell date={payment?.date} />
        </Text>
      )}
      {payment?.method && (
        <Text style={{ textAlign: 'center' }}>{payment?.method}</Text>
      )}
      <CurrencyAmount
        style={{ textAlign: 'center' }}
        amount={payment?.amount}
      />
    </View>
  )
}

export default ScreenPaymentsDetails

const styles = StyleSheet.create({})
