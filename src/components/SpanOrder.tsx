import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { useNavigation } from '@react-navigation/native'
import { currentRentPeriod } from '../libs/orders'

const SpanOrder = ({
  orderId,
  redirect,
  name,
  time
}: {
  orderId: string
  redirect?: boolean
  name?: boolean
  time?: boolean
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
          <OrderData order={order} time={time} name={name} />
        ) : (
          <Text>{orderId}</Text>
        )}
      </Pressable>
    )
  }
  return (
    <>
      {!!order ? (
        <OrderData order={order} time={time} name={name} />
      ) : (
        <Text>{orderId}</Text>
      )}
    </>
  )
}

const OrderData = ({
  order,
  name,
  time
}: {
  order: Partial<ConsolidatedOrderType>
  name?: boolean
  time?: boolean
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ marginRight: 4 }}>
        {order?.folio}-{order?.note}
      </Text>
      {name && <Text style={{ marginRight: 4 }}>{order?.fullName}</Text>}
      {time && (
        <Text style={{ marginRight: 4 }}>
          {currentRentPeriod(order, { shortLabel: true })}
        </Text>
      )}
    </View>
  )
}

export default SpanOrder

const styles = StyleSheet.create({})
