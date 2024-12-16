import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceOrder } from '../../types/StoreBalance'
import CurrencyAmount from '../CurrencyAmount'
import React from 'react'
import { gStyles } from '../../styles'
import theme from '../../theme'
const BalanceOrderRow = (props: BalanceOrderRowProps) => {
  const order = props.order
  const paymentAmount = order.payments.reduce((acc, payment) => {
    // omit canclations
    if (!!payment.canceledAt) return acc
    return acc + payment.amount
  }, 0)
  const itemNumber = order?.items?.map((item) => item?.itemEco).join(', ')
  return (
    <View>
      <Text>{order.clientName}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={gStyles.helper}>
          <Text>{order.orderFolio}</Text>

          {paymentAmount > 0 && (
            <React.Fragment>
              <Text> - </Text>
              <CurrencyAmount
                amount={paymentAmount}
                style={{
                  fontWeight: 'bold',
                  ...gStyles.helper,
                  backgroundColor: theme.success,
                  borderRadius: 9999,
                  paddingVertical: 0,
                  paddingHorizontal: 3,
                  color: theme.white,
                  textAlignVertical: 'center',
                  marginRight: 4
                }}
              />
            </React.Fragment>
          )}
          <Text> - </Text>
          <Text style={gStyles.tBold}>{itemNumber}</Text>
        </Text>
      </View>
    </View>
  )
}
export type BalanceOrderRowProps = {
  order: StoreBalanceOrder
}
export const BalanceOrderRowE = (props: BalanceOrderRowProps) => (
  <ErrorBoundary componentName="BalanceOrderRow">
    <BalanceOrderRow {...props} />
  </ErrorBoundary>
)
export default BalanceOrderRow
