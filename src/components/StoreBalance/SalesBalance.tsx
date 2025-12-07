import { Text, View } from 'react-native'
import { isBetweenDates } from '../../libs/utils-date'
import { order_type } from '../../types/OrderType'
import type { StoreBalanceType } from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import ErrorBoundary from '../ErrorBoundary'
import { ExpandibleBalanceOrders } from './SectionBalanceRents'

const SalesBalance = (props: SalesProps) => {
	const saleOrders = props?.balance?.orders.filter(order => order.orderType === order_type.SALE)
	const payments = saleOrders.flatMap(order => order.payments)

	const created = saleOrders.filter(order =>
		isBetweenDates(order.createdAt, {
			startDate: props.balance.fromDate,
			endDate: props.balance.toDate
		})
	)
	const paid = saleOrders.filter(order =>
		isBetweenDates(order.paidAt, {
			startDate: props.balance.fromDate,
			endDate: props.balance.toDate
		})
	)
	return (
		<View>
			<BalanceAmountsE payments={payments} />
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-evenly'
				}}
			>
				<ExpandibleBalanceOrders orders={created} label="Creadas " defaultExpanded />
				<ExpandibleBalanceOrders orders={paid} label="Pagadas " defaultExpanded />
			</View>
		</View>
	)
}
export type SalesProps = {
	balance: StoreBalanceType
}
export const SalesBalanceE = (props: SalesProps) => (
	<ErrorBoundary componentName="Sales">
		<SalesBalance {...props} />
	</ErrorBoundary>
)
export default SalesBalance
