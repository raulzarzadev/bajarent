import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { useNavigation } from '@react-navigation/native'
import { currentRentPeriod, lastExtensionTime } from '../libs/orders'
import { translateTime } from '../libs/expireDate'
import CurrencyAmount from './CurrencyAmount'
import { payments_amount } from '../libs/payments'
import { isSameDay } from 'date-fns'
import asDate from '../libs/utils-date'
import { Timestamp } from 'firebase/firestore'

const SpanOrder = ({
  orderId,
  redirect,
  showName,
  showTime,
  showLastExtension,
  showDatePaymentsAmount
}: {
  orderId: string
  redirect?: boolean
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
  showDatePaymentsAmount?: Date | Timestamp
}) => {
  const [order, setOrder] = useState<Partial<ConsolidatedOrderType>>()
  const { consolidatedOrders } = useOrdersCtx()
  const { navigate } = useNavigation()
  useEffect(() => {
    const orderFound = consolidatedOrders?.orders?.[orderId]
    setOrder(orderFound || null)
  }, [consolidatedOrders])

  if (redirect) {
    return (
      <Pressable
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'OrderDetails',
            params: {
              orderId
            }
          })
        }}
      >
        {!!order ? (
          <OrderData
            order={order}
            showTime={showTime}
            showName={showName}
            showLastExtension={showLastExtension}
            showDatePaymentsAmount={showDatePaymentsAmount}
          />
        ) : (
          <Text>{orderId}</Text>
        )}
      </Pressable>
    )
  }
  return (
    <>
      {!!order ? (
        <OrderData
          order={order}
          showTime={showTime}
          showName={showName}
          showLastExtension={showLastExtension}
          showDatePaymentsAmount={showDatePaymentsAmount}
        />
      ) : (
        <Text>{orderId}</Text>
      )}
    </>
  )
}

const OrderData = ({
  order,
  showName,
  showTime,
  showLastExtension,
  showDatePaymentsAmount
}: {
  order: Partial<ConsolidatedOrderType>
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
  showDatePaymentsAmount?: Date | Timestamp
}) => {
  const dateAmounts = payments_amount(
    order?.payments?.filter((payment) =>
      isSameDay(asDate(payment?.createdAt), asDate(showDatePaymentsAmount))
    )
  )

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ marginRight: 4 }}>
        {order?.folio}-{order?.note}
      </Text>
      {showLastExtension && (
        <Text style={{ fontWeight: 'bold' }}>
          {' '}
          {translateTime(lastExtensionTime(order), { shortLabel: true })}{' '}
        </Text>
      )}
      {showName && <Text style={{ marginRight: 4 }}>{order?.fullName} </Text>}
      {showDatePaymentsAmount && !!dateAmounts?.incomes && (
        <CurrencyAmount
          amount={dateAmounts?.incomes}
          style={{ fontWeight: 'bold' }}
        />
      )}
    </View>
  )
}

export default SpanOrder

const styles = StyleSheet.create({})
