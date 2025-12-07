import { Text, View } from 'react-native'
import { gStyles } from '../../styles'
import type { StoreBalanceType } from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import ErrorBoundary from '../ErrorBoundary'

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
