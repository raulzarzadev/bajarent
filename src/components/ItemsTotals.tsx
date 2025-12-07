import { Text, View } from 'react-native'
import { gSpace, gStyles } from '../styles'
import CurrencyAmount from './CurrencyAmount'
import type { ItemSelected } from './FormSelectItem'

const Totals = ({ items = [] }: { items: ItemSelected[] }) => {
	const total = items?.reduce((acc, item) => acc + (item.priceSelected?.amount || 0), 0)

	return (
		<View style={{ justifyContent: 'center', marginBottom: gSpace(4) }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Text style={{ textAlign: 'center', marginRight: 4 }}> Total: </Text>
				<CurrencyAmount style={gStyles.h1} amount={total} />
			</View>
		</View>
	)
}

export default Totals
