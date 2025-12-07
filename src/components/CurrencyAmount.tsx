import { Text, type TextStyle } from 'react-native'

const CurrencyAmount = ({ amount = 0, style }: { amount: number; style?: TextStyle }) => {
	const _amount = parseFloat(`${amount}`)
	const isNumber = typeof _amount === 'number'
	if (!isNumber) {
		console.error('NaN')
		return <Text style={[style]}>$0.00</Text>
	}
	return (
		<Text style={[style, { alignContent: 'center' }]} numberOfLines={1}>
			{_amount?.toLocaleString('es-MX', {
				style: 'currency',
				currency: 'MXN'
			})}
		</Text>
	)
}

export default CurrencyAmount
