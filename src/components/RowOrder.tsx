import { Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import ErrorBoundary from './ErrorBoundary'
import ListRow, { ListRowField } from './ListRow'
export type RowOrderProps = {
  item: OrderType
  showTime?: boolean
  showTotal?: boolean
  showTodayAmount?: boolean
}
const RowOrder = ({ item: order }: RowOrderProps) => {
  const fields: ListRowField[] = [
    {
      width: 100,
      component: (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ textAlign: 'center', flex: 1 }} numberOfLines={1}>
              {order?.folio}
              {!!order?.note && <Text>-{order?.note}</Text>}
            </Text>
          </View>
          <Text style={{ textAlign: 'center' }} numberOfLines={1}>
            <ClientName order={order} />
          </Text>
        </View>
      )
    },

    {
      width: 50,
      component: (
        <View>
          <Text style={gStyles.helper} numberOfLines={2}>
            {order?.neighborhood}
          </Text>
        </View>
      )
    },
    // {
    //   field: 'items',
    //   width: '15%',
    //   component: (
    //     <View>
    //       <></>
    //     </View>
    //   )
    // },
    {
      width: 'rest',
      component: (
        <View>
          <OrderDirectives order={order} />
        </View>
      )
    }
  ]
  return <ListRow fields={fields} style={{ marginVertical: 2, padding: 1 }} />
}

export default RowOrder

export const RowOrderE = (props: RowOrderProps) => (
  <ErrorBoundary componentName="RowOrder">
    <RowOrder {...props} />
  </ErrorBoundary>
)
