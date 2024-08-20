import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import ErrorBoundary from './ErrorBoundary'
import ListRow, { ListRowField } from './ListRow'

export type RowOrderType = OrderType & {
  itemsNumbers?: string
  itemsString?: string
}
export type RowOrderProps = {
  item: RowOrderType
  showTime?: boolean
  showTotal?: boolean
  showTodayAmount?: boolean
}
const RowOrder = ({ item: order }: RowOrderProps) => {
  const bigScreen = Dimensions.get('window').width > 500
  const fields: ListRowField[] = [
    {
      width: bigScreen ? 'rest' : 100,
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
          {!!order?.itemsString && (
            <Text
              numberOfLines={1}
              style={[gStyles.helper, gStyles.tBold, gStyles.tCenter]}
            >
              {order?.itemsString}
            </Text>
          )}
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
      width: bigScreen ? 300 : 'rest',
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
