import { useState } from 'react'
import { View } from 'react-native'
import DateCounts from './DateCounts'
import HeaderDate from './HeaderDate'

const StoreCounts = () => {
	const [date, setDate] = useState(new Date())

	return (
		<View style={{ width: '100%' }}>
			<HeaderDate
				debounce={400}
				label="Cuentas"
				onChangeDate={date => {
					setDate(date)
				}}
			/>
			<DateCounts date={date} />
		</View>
	)
}

export default StoreCounts
