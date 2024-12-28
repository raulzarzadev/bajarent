import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { lastExtensionTime } from '../libs/orders'
import { translateTime } from '../libs/expireDate'
import CurrencyAmount from './CurrencyAmount'
import { payments_amount } from '../libs/payments'
import { isSameDay } from 'date-fns'
import asDate from '../libs/utils-date'
import { Timestamp } from 'firebase/firestore'
import theme from '../theme'
import { gStyles } from '../styles'
import useMyNav from '../hooks/useMyNav'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'

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
  const [order, setOrder] =
    useState<Partial<ConsolidatedOrderType | OrderType>>()
  const { orders, payments } = useOrdersCtx()
  const { toOrders } = useMyNav()

  useEffect(() => {
    const searchOrder = async () => {
      // -> Search and return from CURRENT CONTEXT orders
      const currentOrdersFound = orders?.find((o) => o.id === orderId)
      if (currentOrdersFound) {
        return {
          ...currentOrdersFound,
          payments: payments?.filter((p) => p.orderId === orderId)
        }
      }

      // -> Search and return from DATABASE orders
      const dbOrder = await ServiceOrders.get(orderId)
      if (dbOrder) {
        return {
          ...dbOrder,
          payments: payments?.filter((p) => p.orderId === orderId)
        }
      }
    }

    searchOrder().then((res) => {
      //  console.log({ order: res })
      setOrder(res)
    })
  }, [])

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
  order: Partial<ConsolidatedOrderType | OrderType>
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
            ?.map((item) => item?.number || item?.serial || item?.id || 'U.U') // this means that any of the info was found
            .join(', ')}
        </Text>
      )}
    </View>
  )
}

export default SpanOrder

const styles = StyleSheet.create({})
