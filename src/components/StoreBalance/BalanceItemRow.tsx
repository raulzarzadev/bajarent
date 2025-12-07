import { Text, View } from 'react-native'
import type ItemType from '../../types/ItemType'
import ErrorBoundary from '../ErrorBoundary'

const BalanceItemRow = (props: BalanceItemRowProps) => {
	const item = props.item

	return (
		<View>
			<Text>
				{item.eco} {item.categoryName}
			</Text>
		</View>
	)
}
export type BalanceItemRowProps = {
	item: ItemType
}
export const BalanceItemRowE = (props: BalanceItemRowProps) => (
	<ErrorBoundary componentName="BalanceItemRow">
		<BalanceItemRow {...props} />
	</ErrorBoundary>
)
export default BalanceItemRow
