import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import HeaderDate from './HeaderDate'
import DateCounts from './DateCounts'

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

const styles = StyleSheet.create({})
