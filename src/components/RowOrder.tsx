import { Dimensions, Text, View } from 'react-native'
import OrderType from '../types/OrderType'
import ClientName from './ClientName'
import { gStyles } from '../styles'
import OrderDirectives from './OrderDirectives'
import ErrorBoundary from './ErrorBoundary'
import ListRow, { ListRowField } from './ListRow'
import { ModalOrderQuickActionsE } from './ModalOrderQuickActions'

export type RowOrderType = OrderType & {
	itemsNumbers?: string
	itemsString?: string
}
export type RowOrderProps = {
	item: RowOrderType
	showTime?: boolean
	showTotal?: boolean
	showTodayAmount?: boolean
}
const RowOrder = ({ item: order }: RowOrderProps) => {
	const bigScreen = Dimensions.get('window').width > 500
	const fields: ListRowField[] = [
		{
			width: 12,
			component: (
				<View
					style={{
						width: 12,
						height: '100%',
						borderBottomLeftRadius: 4,
						borderTopLeftRadius: 4,
						backgroundColor: order?.colorLabel,
						marginHorizontal: 0,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<ModalOrderQuickActionsE orderId={order?.id} />
				</View>
			)
		},

		{
			width: 'rest',
			component: (
				<View
					style={{
						//flexDirection: 'row'
						flexDirection: bigScreen ? 'row' : 'column-reverse'
					}}
				>
					<View
						style={{
							width: bigScreen ? '40%' : '100%'
						}}
					>
						<View style={{ flexDirection: 'row' }}>
							{/* FOLIO AND NUMBER NOTE */}
							<View
								style={{
									// textAlign: 'center',
									flexDirection: 'column',
									flex: 1,
									width: '20%'
								}}
							>
								<Text numberOfLines={1}>{order?.folio}</Text>
								<Text numberOfLines={1} style={gStyles.helper}>
									{order?.note}
								</Text>
							</View>

							{/* CUSTOMER NAME */}
							<Text style={{ width: '50%' }} numberOfLines={1}>
								<ClientName order={order} />
							</Text>

							{/* NEIGHBORHOOD */}
							<Text style={{ width: '30%' }} numberOfLines={1}>
								{order?.neighborhood}
							</Text>
						</View>
						{!!order?.itemsString && (
							<Text numberOfLines={1} style={[gStyles.helper, gStyles.tBold, gStyles.tCenter]}>
								{order?.itemsString}
							</Text>
						)}
					</View>

					<View
						style={{
							width: bigScreen ? '60%' : '100%',
							justifyContent: 'flex-start'
						}}
					>
						<OrderDirectives order={order} />
					</View>
				</View>
			)
		}
	]
	return <ListRow fields={fields} style={{ marginVertical: 2, padding: 0 }} />
}

export default RowOrder

export const RowOrderE = (props: RowOrderProps) => (
	<ErrorBoundary componentName="RowOrder">
		<RowOrder {...props} />
	</ErrorBoundary>
)
