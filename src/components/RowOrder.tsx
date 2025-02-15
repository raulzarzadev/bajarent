import { Dimensions, Text, View } from 'react-native'
import OrderType from '../types/OrderType'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import ErrorBoundary from './ErrorBoundary'
import ListRow, { ListRowField } from './ListRow'
import { ModalOrderQuickActionsE } from './ModalOrderQuickActions'
import Button from './Button'
import useMyNav from '../hooks/useMyNav'

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
  const { toCustomers } = useMyNav()
  const bigScreen = Dimensions.get('window').width > 500
  const fields: ListRowField[] = [
    {
      width: 12,
      component: (
        <View
          style={{
            width: 12,
            height: '100%',
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4,
            backgroundColor: order?.colorLabel,
            marginHorizontal: 0
          }}
        ></View>
      )
    },
    {
      width: 'auto',
      component: (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
            //backgroundColor: order.colorLabel,
          }}
        >
          <ModalOrderQuickActionsE orderId={order.id} />
        </View>
      )
    },
    {
      width: 'rest',
      component: (
        <View
          style={{
            //flexDirection: 'row'
            flexDirection: bigScreen ? 'row' : 'column-reverse'
          }}
        >
          <View style={{ width: 160, margin: bigScreen ? null : 'auto' }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  // textAlign: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1
                }}
                // numberOfLines={1}
              >
                <Text numberOfLines={1}>{order?.folio}</Text>
                {!!order?.note && <Text numberOfLines={1}>-{order?.note}</Text>}
              </View>
            </View>
            <Text style={[{ textAlign: 'center' }]} numberOfLines={1}>
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
            <Text
              style={[gStyles.helper, { textAlign: 'center' }]}
              numberOfLines={1}
            >
              {order?.neighborhood}
            </Text>
          </View>

          <View style={{ justifyContent: 'flex-start' }}>
            <OrderDirectives order={order} />
          </View>
        </View>
      )
    },

    {
      width: 34,
      component: order.customerId ? (
        <Button
          icon="customerCard"
          size="xs"
          fullWidth={false}
          onPress={() => {
            toCustomers({ to: 'details', id: order.customerId })
          }}
        />
      ) : null
    }
  ]
  return <ListRow fields={fields} style={{ marginVertical: 2, padding: 0 }} />
}

export default RowOrder

export const RowOrderE = (props: RowOrderProps) => (
  <ErrorBoundary componentName="RowOrder">
    <RowOrder {...props} />
  </ErrorBoundary>
)
