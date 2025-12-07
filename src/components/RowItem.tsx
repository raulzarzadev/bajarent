import { Text, View, type ViewStyle } from 'react-native'
import { gStyles } from '../styles'
import CurrencyAmount from './CurrencyAmount'
import type { ItemSelected } from './FormSelectItem'
import ListRow, { type ListRowField } from './ListRow'

const RowItem = ({ item, style }: { item: Partial<ItemSelected>; style?: ViewStyle }) => {
	const fields: ListRowField[] = [
		{
			component: (
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text numberOfLines={1} style={[gStyles.h1, { textAlign: 'center', paddingRight: 4 }]}>
						{item.number}
					</Text>
					{!!item.serial && (
						<Text style={[gStyles.helper, { textAlign: 'center' }]}>{item.serial}</Text>
					)}
				</View>
			),
			width: 'auto'
		},
		{
			component: (
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text style={[]}>{item.categoryName}</Text>
				</View>
			),
			width: 'rest'
		},

		{
			component: <Text style={{ textAlign: 'center' }}>{item.priceSelected?.title}</Text>,
			width: 70
		},
		{
			component: (
				<CurrencyAmount
					style={{ ...gStyles.tBold, textAlign: 'center' }}
					amount={(item.priceSelected?.amount || 0) * (item.priceQty || 1)}
				/>
			),
			width: 80
		}
	]
	return <ListRow fields={fields} style={{ borderColor: 'transparent', ...style }} />
}

export default RowItem
