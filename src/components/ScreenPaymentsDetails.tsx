import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import { OrderDirectives } from './OrderDetails'
import Button from './Button'

const ScreenPaymentsDetails = ({ route, navigation }) => {
  const { id } = route.params
  const { payments, orders, staff } = useStore()
  const payment = payments.find((p) => p.id === id)
  const order = orders.find((o) => o.id === payment.orderId)
  const userName =
    staff.find((s) => s.userId === payment.createdBy)?.name || 'sin nombre'
  return (
    <View style={gStyles.container}>
      <CurrencyAmount style={gStyles.h1} amount={payment?.amount} />
      {payment?.method && (
        <Text
          style={{
            textAlign: 'center',
            marginVertical: 8,
            textTransform: 'capitalize'
          }}
        >
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

      {payment?.createdAt && (
        <Text style={{ textAlign: 'center', marginTop: 16 }}>
          <DateCell date={payment?.createdAt} />
        </Text>
      )}
      {payment?.createdBy && (
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={[gStyles.helper, { textAlign: 'center', marginBottom: 16 }]}
          >
            Cobrado por: <Text>{userName}</Text>
          </Text>
        </View>
      )}

      <View style={{ justifyContent: 'center', margin: 'auto' }}>
        {order ? <OrderDirectives order={order} /> : <ActivityIndicator />}
        <Button
          variant="ghost"
          onPress={() => {
            navigation.navigate('Orders')
            navigation.navigate('OrderDetails', { orderId: order?.id })
            // navigation.navigate('Orders', {
            //   screen: 'OrderDetails',
            //   params: { orderId: order?.id }
            // })
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
