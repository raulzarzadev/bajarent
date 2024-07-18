import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { useNavigation } from '@react-navigation/native'
import { currentRentPeriod, lastExtensionTime } from '../libs/orders'
import { translateTime } from '../libs/expireDate'

const SpanOrder = ({
  orderId,
  redirect,
  showName,
  showTime,
  showLastExtension
}: {
  orderId: string
  redirect?: boolean
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
}) => {
  const [order, setOrder] = useState<Partial<ConsolidatedOrderType>>()
  const { consolidatedOrders } = useOrdersCtx()
  const { navigate } = useNavigation()
  useEffect(() => {
    const orderFound = consolidatedOrders?.orders?.[orderId]
    setOrder(orderFound || null)
  }, [])

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
  showLastExtension
}: {
  order: Partial<ConsolidatedOrderType>
  showName?: boolean
  showTime?: boolean
  showLastExtension?: boolean
}) => {
  if (order.folio === 312) {
    console.log({ orderExt: order })
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ marginRight: 4 }}>
        {order?.folio}-{order?.note}
      </Text>
      {showName && <Text style={{ marginRight: 4 }}>{order?.fullName}</Text>}
      {showLastExtension && (
        <Text>{translateTime(lastExtensionTime(order))}</Text>
      )}
    </View>
  )
}

export default SpanOrder

const styles = StyleSheet.create({})
