import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { BalanceAmountsE } from '../BalanceAmounts'
import { StoreBalanceType } from '../../types/StoreBalance'
import { order_type } from '../../types/OrderType'
import { ExpandibleBalanceOrders } from './SectionBalanceRents'
import { isBetweenDates } from '../../libs/utils-date'
const SalesBalance = (props: SalesProps) => {
	const saleOrders = props?.balance?.orders.filter(order => order.orderType === order_type.SALE)
	const payments = saleOrders.map(order => order.payments).flat()

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
