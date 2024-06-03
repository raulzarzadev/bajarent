import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import LinkLocation from './LinkLocation'
import List, { LoadingList } from './List'
import OrderType, { order_status } from '../types/OrderType'
import ListRow, { ListRowField } from './ListRow'
import { ItemMap, ItemMapE } from './ItemsMap'
import theme, { colors } from '../theme'
import { formatOrders } from '../libs/orders'
import { ServiceComments } from '../firebase/ServiceComments'

const ScreenItemsMap = () => {
  const [locatedOrders, setLocatedOrders] = useState<OrderType[]>([])
  const { storeId } = useStore()
  useEffect(() => {
    if (storeId) {
      ServiceOrders.getRentItemsLocation(storeId)
        .then(async (res) => {
          const reports = await ServiceComments.getReportsUnsolved(storeId)
          const formattedORders = formatOrders({ orders: res, reports })
          setLocatedOrders(formattedORders)
          setLocatedOrders(formattedORders.filter((item) => item.location))
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [storeId])

  return (
    <ScrollView>
      <ItemMapE orders={locatedOrders} />
      <LoadingList
        sortFields={[
          { key: 'fullName', label: 'Nombre' },
          { key: 'itemSerial', label: 'Serie' },
          { key: 'itemBrand', label: 'Marca' }
        ]}
        ComponentRow={({ item }) => <OrderLocationRow order={item} />}
        filters={[]}
        data={locatedOrders}
      />
    </ScrollView>
  )
}

const OrderLocationRow = ({ order }: { order: OrderType }) => {
  const fields: ListRowField[] = [
    {
      width: '20%',
      component: <Text>{order.fullName}</Text>
    },
    {
      width: '20%',
      component: (
        <Text numberOfLines={2} style={{ fontSize: 12 }}>
          {order.location}
        </Text>
      )
    },
    {
      width: '20%',
      component: <Text>{order.itemSerial}</Text>
    },
    {
      width: '20%',
      component: <Text>{order.itemBrand}</Text>
    },
    {
      width: '20%',
      component: <LinkLocation location={order.location} />
    }
  ]
  return <ListRow fields={fields} />
}

export default ScreenItemsMap

const styles = StyleSheet.create({})
