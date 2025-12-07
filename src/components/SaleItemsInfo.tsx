import { StyleSheet, Text, View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import theme from '../theme'
import type { SaleOrderItem } from '../types/OrderType'
import CurrencyAmount from './CurrencyAmount'
import ErrorBoundary from './ErrorBoundary'

export const SaleItemsInfo = () => {
	const { order } = useOrderDetails()
	const { categories } = useStore()
	const items = order?.items as SaleOrderItem[]
	const total = items?.reduce((acc, item) => acc + item.price * item.quantity, 0)
	return (
		<ErrorBoundary componentName="SaleItemsInfo">
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>Categoria</Text>
				<Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>Serie</Text>
				<Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>Precio</Text>
				<Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>Cantidad</Text>
				<Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>Monto</Text>
			</View>

			{items?.map((item, i) => (
				<View key={item.id || i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.saleItemCell}>
						{categories?.find(cat => cat.id === item.category)?.name}
					</Text>
					<Text style={styles.saleItemCell}>{item.serial}</Text>
					<CurrencyAmount style={styles.saleItemCell} amount={item.price} />
					<Text style={styles.saleItemCell}>{item.quantity}</Text>
					<CurrencyAmount style={styles.saleItemCell} amount={item.price * item.quantity} />
				</View>
			))}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					marginTop: 8
				}}
			>
				<Text>Total: </Text>
				<CurrencyAmount amount={total} style={gStyles.h3} />
			</View>
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	saleItemCell: {
		width: '20%',
		textAlign: 'center',
		padding: 4
	},
	saleItemCellTitle: {
		fontWeight: 'bold'
	}
})

export type SaleItemsInfoProps = {}
export const SaleItemsInfoE = (props: SaleItemsInfoProps) => (
	<ErrorBoundary componentName="SaleItemsInfo">
		<SaleItemsInfo {...props} />
	</ErrorBoundary>
)
