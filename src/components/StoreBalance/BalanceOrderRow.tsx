import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceOrder } from '../../types/StoreBalance'
import CurrencyAmount from '../CurrencyAmount'
import React from 'react'
import { gStyles } from '../../styles'
import theme from '../../theme'
import { useStore } from '../../contexts/storeContext'
import { translateTime } from '../../libs/expireDate'
const BalanceOrderRow = (props: BalanceOrderRowProps) => {
  const order = props.order
  const { categories } = useStore()
  const paymentAmount = order.payments.reduce((acc, payment) => {
    // omit canclations
    if (!!payment.canceledAt) return acc
    return acc + payment.amount
  }, 0)

  const itemNumber = order?.items?.map((item) => item?.itemEco).join(', ')
  const matchedPrice = categories
    ?.map((cat) => cat.prices)
    ?.flat()
    ?.find((price) => price?.id === order?.items?.[0]?.priceId)
  console.log({ matchedPrice })
  const paymentAndPriceMatches = matchedPrice?.amount === paymentAmount
  return (
    <View>
      <Text>{order.clientName}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={gStyles.helper}>{order.orderFolio}</Text>

        {paymentAmount > 0 && (
          <React.Fragment>
            <Text style={gStyles.helper}> - </Text>
            <CurrencyAmount
              amount={paymentAmount}
              style={{
                fontWeight: 'bold',
                ...gStyles.helper,
                backgroundColor: paymentAndPriceMatches
                  ? theme.success
                  : theme.error,
                borderRadius: 9999,
                paddingVertical: 0,
                paddingHorizontal: 3,
                color: theme.white,
                textAlignVertical: 'center',
                marginRight: 2
              }}
            />
          </React.Fragment>
        )}
        <Text style={gStyles.helper}>
          {translateTime(order.time, { shortLabel: true })}
        </Text>

        <Text style={gStyles.helper}> - </Text>
        <Text style={[gStyles.tBold, gStyles.helper]}>{itemNumber}</Text>
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
