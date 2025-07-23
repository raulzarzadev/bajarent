import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import LinkLocation from './LinkLocation'
import OrderType from '../types/OrderType'
import ListRow, { ListRowField } from './ListRow'
import { ItemMapE } from './ItemsMap'
import { formatOrders } from '../libs/orders'
import { ServiceComments } from '../firebase/ServiceComments'
import { ModalFilterListE } from './ModalFilterList'

const ScreenItemsMap = () => {
  const [locatedOrders, setLocatedOrders] = useState<Partial<OrderType>[]>([])
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
      <View>
        <View style={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
          <ModalFilterListE
            data={locatedOrders}
            setData={(orders) => {
              console.log({ orders })
            }}
            filters={[
              {
                field: 'status',
                label: 'Status'
              }
            ]}
          />
        </View>
        <View style={{}}>
          <ItemMapE orders={locatedOrders} />
        </View>
      </View>
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
