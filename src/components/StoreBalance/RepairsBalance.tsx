import { Text, View } from 'react-native'
import { isBetweenDates } from '../../libs/utils-date'
import { order_type } from '../../types/OrderType'
import type { StoreBalanceType } from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import ErrorBoundary from '../ErrorBoundary'
import { ExpandibleBalanceOrders } from './SectionBalanceRents'

const RepairsBalance = (props: RepairsBalanceProps) => {
	const balance = props.balance

	const repairsOrders = balance.orders.filter(order => order.orderType === order_type.REPAIR)
	const payments = repairsOrders.flatMap(order => order.payments)
	const repairStarted = repairsOrders.filter(order =>
		isBetweenDates(order.repairingAt, {
			startDate: balance.fromDate,
			endDate: balance.toDate
		})
	)
	const repairsDelivered = repairsOrders.filter(order =>
		isBetweenDates(order.deliveredAt, {
			startDate: balance.fromDate,
			endDate: balance.toDate
		})
	)
	const repairsPaid = repairsOrders.filter(order =>
		isBetweenDates(order.payments[0]?.createdAt, {
			startDate: balance.fromDate,
			endDate: balance.toDate
		})
	)

	return (
		<View>
			<BalanceAmountsE payments={payments} />
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					flexWrap: 'wrap'
				}}
			>
				<ExpandibleBalanceOrders orders={repairStarted} label="Recogidas" defaultExpanded />
				<ExpandibleBalanceOrders orders={repairsDelivered} label="Entregadas" defaultExpanded />
				<ExpandibleBalanceOrders orders={repairsPaid} label="Cobradas" defaultExpanded />
			</View>
		</View>
	)
}
export type RepairsBalanceProps = {
	balance: StoreBalanceType
}
export const RepairsBalanceE = (props: RepairsBalanceProps) => (
	<ErrorBoundary componentName="RepairsBalance">
		<RepairsBalance {...props} />
	</ErrorBoundary>
)
export default RepairsBalance
