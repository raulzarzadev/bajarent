import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderDirectives from './OrderDirectives'

const ScreenPaymentsDetails = ({ route, navigation }) => {
  const { id } = route.params
  const { payments, staff } = useStore()
  const payment = payments?.find((p) => p?.id === id)
  const [order, setOrder] = useState<OrderType>()
  useEffect(() => {
    ServiceOrders.get(payment?.orderId).then((order) => {
      console.log({ order })
      if (order) {
        setOrder(order)
      } else {
        setOrder(null)
      }
    })
  }, [payment?.orderId])
  const userName =
    staff.find((s) => s.userId === payment?.createdBy)?.name || 'sin nombre'
  return (
    <View style={gStyles.container}>
      <CurrencyAmount style={gStyles.h1} amount={payment?.amount} />
      {!!payment?.method && (
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
      {!!payment?.reference && (
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 8 }]}
        >
          {payment?.reference}
        </Text>
      )}

      {!!payment?.createdAt && (
        <Text style={{ textAlign: 'center', marginTop: 16 }}>
          <DateCell date={payment?.createdAt} />
        </Text>
      )}
      {!!payment?.createdBy && (
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={[gStyles.helper, { textAlign: 'center', marginBottom: 16 }]}
          >
            Cobrado por: <Text>{userName}</Text>
          </Text>
        </View>
      )}

      <View style={{ justifyContent: 'center', margin: 'auto' }}>
        {order === undefined && <ActivityIndicator />}
        {order === null && <Text>Orden no encontrada</Text>}
        {!!order && <OrderDirectives order={order} />}
        <Button
          variant="ghost"
          onPress={() => {
            navigation.navigate('StackOrders', {
              screen: 'OrderDetails',
              params: { orderId: order?.id }
            })
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
