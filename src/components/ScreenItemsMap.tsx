import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import LinkLocation from './LinkLocation'
import List from './List'
import OrderType from '../types/OrderType'
import ListRow, { ListRowField } from './ListRow'

const ScreenItemsMap = () => {
  const [locatedOrders, setLocatedOrders] = useState([])
  const { storeId } = useStore()
  useEffect(() => {
    if (storeId) {
      ServiceOrders.getRentItemsLocation(storeId)
        .then((res) => {
          setLocatedOrders(res)
          setLocatedOrders(res.filter((item) => item.location))
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [storeId])

  return (
    <ScrollView>
      <List
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
      field: order.fullName,
      width: '20%',
      component: <Text>{order.fullName}</Text>
    },
    {
      field: order.location,
      width: '20%',
      component: (
        <Text numberOfLines={2} style={{ fontSize: 12 }}>
          {order.location}
        </Text>
      )
    },
    {
      field: order.itemSerial,
      width: '20%',
      component: <Text>{order.itemSerial}</Text>
    },
    {
      field: order.itemBrand,
      width: '20%',
      component: <Text>{order.itemBrand}</Text>
    },
    {
      field: order.location,
      width: '20%',
      component: <LinkLocation location={order.location} />
    }
  ]
  return <ListRow fields={fields} />
}

export default ScreenItemsMap

const styles = StyleSheet.create({})
