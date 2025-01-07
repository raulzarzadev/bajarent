import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceType } from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import { order_type } from '../../types/OrderType'
import { gStyles } from '../../styles'
const GeneralBalance = (props: GeneralBalanceProps) => {
  const balance = props?.balance
  const repairPayments = balance?.orders
    .filter((o) => o.orderType === order_type.REPAIR)
    .map((o) => o.payments)
    .flat()
  const rentsPayments = balance?.orders
    .filter((o) => o.orderType === order_type.RENT)
    .map((o) => o.payments)
    .flat()
  const salePayments = balance?.orders
    .filter((o) => o.orderType === order_type.SALE)
    .map((o) => o.payments)
    .flat()
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
        <Text style={[gStyles.h3]}>Rentas</Text>
        <BalanceAmountsE payments={rentsPayments} />
      </View>
      <View>
        <Text style={[gStyles.h3]}>Reparaciones</Text>
        <BalanceAmountsE payments={repairPayments} />
      </View>
      <View>
        <Text style={[gStyles.h3]}>Ventas</Text>
        <BalanceAmountsE payments={salePayments} />
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
