import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceType } from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import { gStyles } from '../../styles'
const GeneralBalance = (props: GeneralBalanceProps) => {
  const balance = props?.balance
  const payments = balance?.payments

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        paddingTop: 8
      }}
    >
      <View>
        <Text style={[gStyles.h3]}>General</Text>
        <BalanceAmountsE payments={payments} />
      </View>
    </View>
  )
}
export type GeneralBalanceProps = {
  balance: StoreBalanceType
}
export const GeneralBalanceE = (props: GeneralBalanceProps) => (
  <ErrorBoundary componentName="GeneralBalance">
    <GeneralBalance {...props} />
  </ErrorBoundary>
)
export default GeneralBalance
