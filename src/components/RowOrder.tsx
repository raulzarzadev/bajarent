import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import OrderType from '../types/OrderType'
import theme, { STATUS_COLOR, colors } from '../theme'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'

const RowOrder = ({ item: order }: { item: OrderType }) => {
  const fields: {
    field: string
    width: ViewStyle['width']
    component: ReactNode
  }[] = [
    {
      field: 'folio',
      width: '30%',
      component: (
        <View>
          <View style={{ flexDirection: 'row' }}>
            {!order.statuses && (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 9999,
                  backgroundColor: colors.amber
                }}
              />
            )}
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
      field: 'status',
      width: '50%',
      component: (
        <View>
          <OrderDirectives order={order} />
        </View>
      )
    }
  ]
  return (
    <View style={[styles.container]}>
      {fields.map(({ field, component, width }) => (
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
