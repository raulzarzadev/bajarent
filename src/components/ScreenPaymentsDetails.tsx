import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import dictionary from '../dictionary'
import OrderStatus from './OrderStatus'
import ErrorBoundary from './ErrorBoundary'
import { OrderDirectives } from './OrderDetails'
import Button from './Button'

const ScreenPaymentsDetails = ({ route, navigation }) => {
  const { id } = route.params
  const { payments, orders } = useStore()
  const payment = payments.find((p) => p.id === id)
  const order = orders.find((o) => o.id === payment.orderId)

  return (
    <View style={gStyles.container}>
      {/* {order?.status && (
        <Text style={{ textAlign: 'center', textTransform:'uppercase' }}>{dictionary(order?.status)}</Text>
      )} */}

      <CurrencyAmount style={gStyles.h1} amount={payment?.amount} />
      {payment?.method && (
        <Text style={{ textAlign: 'center', marginVertical: 8 }}>
          {dictionary(payment?.method)}
        </Text>
      )}
      {payment?.reference && (
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 8 }]}
        >
          {payment?.reference}
        </Text>
      )}
      {payment?.date && (
        <Text style={{ textAlign: 'center', marginVertical: 16 }}>
          <DateCell date={payment?.date} />
        </Text>
      )}
      <View style={{ justifyContent: 'center', margin: 'auto' }}>
        {order ? <OrderDirectives order={order} /> : <ActivityIndicator />}
        <Button
          variant="ghost"
          onPress={() => {
            navigation.navigate('Orders')
            navigation.navigate('OrderDetails', { orderId: order?.id })
          }}
          label="Ver orden"
        ></Button>
      </View>
    </View>
  )
}

export default function (props) {
  return (
    <ErrorBoundary>
      <ScreenPaymentsDetails {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({})
