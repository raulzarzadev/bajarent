import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceComments } from '../firebase/ServiceComments'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import type OrderType from '../types/OrderType'
import { ItemMapE } from './ItemsMap'
import LinkLocation from './LinkLocation'
import ListRow, { type ListRowField } from './ListRow'
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

export default ScreenItemsMap
