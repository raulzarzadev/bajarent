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
import theme from '../theme'
import { gStyles } from '../styles'
import useMyNav from '../hooks/useMyNav'

const SpanOrder = ({
  orderId,
  redirect,
  showName,
  showTime,
  showLastExtension,
  showDatePaymentsAmount,
  onRedirect,
  showItems
}: {
  orderId: string
  redirect?: boolean
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
  showDatePaymentsAmount?: Date | Timestamp
  onRedirect?: () => void
  showItems?: boolean //<--- show item at the end of line
}) => {
  const [order, setOrder] = useState<Partial<ConsolidatedOrderType>>()
  const { consolidatedOrders } = useOrdersCtx()
  const { toOrders } = useMyNav()

  useEffect(() => {
    const orderFound = consolidatedOrders?.orders?.[orderId]
    setOrder(orderFound || null)
  }, [consolidatedOrders])

  if (redirect) {
    return (
      <Pressable
        onPress={() => {
          toOrders({ id: orderId })
          onRedirect()
        }}
      >
        {!!order ? (
          <OrderData
            order={order}
            showTime={showTime}
            showName={showName}
            showLastExtension={showLastExtension}
            showDatePaymentsAmount={showDatePaymentsAmount}
            showItems
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
          showItems={showItems}
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
  showDatePaymentsAmount,
  showItems
}: {
  order: Partial<ConsolidatedOrderType>
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
  showDatePaymentsAmount?: Date | Timestamp
  showItems?: boolean
}) => {
  const dateAmounts = payments_amount(
    order?.payments?.filter((payment) =>
      isSameDay(asDate(payment?.createdAt), asDate(showDatePaymentsAmount))
    )
  )

  return (
    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
      <Text style={{ marginRight: 4, textAlignVertical: 'center' }}>
        {order?.folio}-{order?.note}
      </Text>
      {showLastExtension && (
        <Text style={{ fontWeight: 'bold', textAlignVertical: 'center' }}>
          {translateTime(lastExtensionTime(order), { shortLabel: true })}{' '}
        </Text>
      )}
      {showDatePaymentsAmount && !!dateAmounts?.incomes && (
        <CurrencyAmount
          amount={dateAmounts?.incomes}
          style={{
            fontWeight: 'bold',
            ...gStyles.helper,
            backgroundColor: theme.success,
            borderRadius: 9999,
            paddingVertical: 0,
            paddingHorizontal: 3,
            color: theme.white,
            textAlignVertical: 'center',
            marginRight: 4
          }}
        />
      )}
      {showName && (
        <Text
          style={{
            //minWidth: 100,
            flex: 1,
            textAlignVertical: 'center'
          }}
          numberOfLines={1}
        >
          {order?.fullName}
        </Text>
      )}
      {showItems && (
        <Text
          style={[
            gStyles.helper,
            gStyles.tBold,
            {
              //textAlignVertical: 'bottom',
              //borderWidth: 1,
              // borderColor: 'red',
              // alignItems: 'stretch'
            }
          ]}
        >
          {order?.items
            ?.map(
              (item) => item?.number || item?.serial || item?.itemId || 'U.U'
            ) // this means that any of the info was found
            .join(', ')}
        </Text>
      )}
    </View>
  )
}

export default SpanOrder

const styles = StyleSheet.create({})
