import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import List from './List'
import { useOrdersCtx } from '../contexts/ordersContext'
import { dateFormat } from '../libs/utils-date'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { CommentRow } from './ListComments'
import formatComments from '../libs/formatComments'
import { useStore } from '../contexts/storeContext'
import { FormattedComment } from '../types/CommentType'

const ScreenReports = ({ navigation }) => {
  const { reports, orders, handleRefresh } = useOrdersCtx()
  const { staff } = useStore()
  const [formatted, setFormatted] = useState<FormattedComment[]>([])
  useEffect(() => {
    setFormatted(formatComments({ comments: reports, orders, staff }))
  }, [reports, orders, staff])
  return (
    <List
      sortFields={[{ key: 'createdAt', label: 'Fecha' }]}
      defaultOrder="des"
      defaultSortBy="createdAt"
      sideButtons={[
        {
          icon: 'refresh',
          label: 'Recargar',
          onPress: handleRefresh,
          visible: true
        }
      ]}
      data={formatted}
      ComponentRow={({ item }) => (
        <CommentRow comment={item} viewOrder={!!orders.length} />
      )}
      filters={[]}
      onPressRow={(reportId) => {
        console.log('reportId', reportId)
        const orderId = reports.find(
          (report) => report.id === reportId
        )?.orderId
        navigation.navigate('OrderDetails', {
          orderId
        })
      }}
    />
  )
}

const RowReport = ({ item }) => {
  const [order, setOrder] = useState<OrderType>()
  const { orders } = useOrdersCtx()
  useEffect(() => {
    const order = orders?.find((order) => order.id === item.orderId)
    setOrder(order)
    if (!order) {
      ServiceOrders.get(item.orderId).then((res) => setOrder(res))
    }
  }, [item.orderId, orders])
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 8
      }}
    >
      <Text>{dateFormat(item?.createdAt, 'dd MMM yy hh:HH')}</Text>
      <View>
        <Text>
          {order?.folio} {order?.note}
        </Text>
        <Text>{order?.fullName}</Text>
      </View>
      <Text>{item?.content}</Text>
    </View>
  )
}

export default ScreenReports

const styles = StyleSheet.create({})
