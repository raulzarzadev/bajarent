import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import OrderType, { order_type } from '../types/OrderType'
import theme, { STATUS_COLOR, colors } from '../theme'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import ErrorBoundary from './ErrorBoundary'
export type RowOrderProps = {
  item: OrderType
  showTime?: boolean
  showTotal?: boolean
  showTodayAmount?: boolean
}
const RowOrder = ({ item: order }: RowOrderProps) => {
  const fields: {
    field: string
    width: ViewStyle['width']
    component: ReactNode
    hide?: boolean
  }[] = [
    {
      field: 'folio',
      width: '25%',
      component: (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ textAlign: 'center', flex: 1 }} numberOfLines={1}>
              {order?.folio}
              {!!order?.note && (
                <Text style={gStyles.helper}> - {order?.note}</Text>
              )}
            </Text>
          </View>
          <Text style={{ textAlign: 'center' }} numberOfLines={1}>
            <ClientName order={order} />
          </Text>
        </View>
      )
    },

    {
      field: 'neighborhood',
      width: '20%',
      component: (
        <View>
          <Text numberOfLines={2}>{order?.neighborhood}</Text>
        </View>
      )
    },
    {
      field: 'items',
      width: '15%',
      component: (
        <View>
          <></>
        </View>
      )
    },
    {
      field: 'status',
      width: '40%',
      component: (
        <View>
          <OrderDirectives order={order} />
        </View>
      )
    }
  ]
  return (
    <View style={[styles.container]}>
      {fields.map(({ field, component, width, hide }) => (
        <View key={field} style={{ width }}>
          {component}
        </View>
      ))}
    </View>
  )
}

export default RowOrder

const styles = StyleSheet.create({
  //
  text: {
    width: '33%',
    textAlign: 'center',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    padding: 4,
    marginVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: theme.neutral,
    backgroundColor: STATUS_COLOR.PENDING
  }
})

export const RowOrderE = (props: RowOrderProps) => (
  <ErrorBoundary componentName="RowOrder">
    <RowOrder {...props} />
  </ErrorBoundary>
)
