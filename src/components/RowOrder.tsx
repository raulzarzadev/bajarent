import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import OrderType, { order_type } from '../types/OrderType'
import theme, { STATUS_COLOR, colors } from '../theme'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import { translateTime } from '../libs/expireDate'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import { payments_amount } from '../libs/payments'
import ErrorBoundary from './ErrorBoundary'
export type RowOrderProps = {
  item: OrderType
  showTime?: boolean
  showTotal?: boolean
}
const RowOrder = ({ item: order, showTime, showTotal }: RowOrderProps) => {
  const { payments } = useStore()
  const orderPayments = payments.filter(
    (p) => p?.orderId && p?.orderId === order?.id
  )
  const orderTotal = payments_amount(orderPayments).total
  const paymentsMethods = Array.from(
    new Set(orderPayments.map((p) => dictionary(p.method)[0]))
  )

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
            {/* {!order?.statuses && (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 9999,
                  backgroundColor: colors.amber
                }}
              />
            )} */}
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
          <>
            {showTime && order.type === order_type.RENT && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <Text style={{ textAlign: 'center' }}>
                  {translateTime(order?.items?.[0]?.priceSelected?.time, {
                    shortLabel: true
                  })}
                </Text>
              </View>
            )}
            {showTotal && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                {paymentsMethods.map((method) => (
                  <Text
                    key={method}
                    style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    {method}
                  </Text>
                ))}
                <CurrencyAmount amount={orderTotal} />
              </View>
            )}
          </>
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
