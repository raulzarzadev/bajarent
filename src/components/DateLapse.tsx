import { View, Text } from 'react-native'
import React from 'react'
import InputDate from './InputDate'
import Icon from './Icon'
import theme from '../theme'

const DateLapse = ({
	fromDate = new Date(),
	toDate = new Date(),
	setFromDate,
	setToDate
}: {
	fromDate?: Date
	toDate?: Date
	setFromDate: (date: Date) => void
	setToDate: (date: Date) => void
}) => {
	const [_fromDate, _setFromDate] = React.useState(fromDate)
	const [_toDate, _setToDate] = React.useState(toDate)

	const handleSetFromDate = (date: Date) => {
		_setFromDate(date)
		setFromDate(date)
	}
	const handleSetToDate = (date: Date) => {
		_setToDate(date)
		setToDate(date)
	}

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-around',
				width: '100%',
				margin: 'auto',
				maxWidth: 600,
				alignItems: 'center'
			}}
		>
			<InputDate
				setValue={value => {
					handleSetFromDate(value)
				}}
				value={_fromDate}
				format="EEE dd MMM yy"
				openButtonProps={{
					size: 'small',
					variant: 'ghost',
					uppercase: false
				}}
			/>
			<Icon icon="rowRight" color={theme.primary} />
			<InputDate
				setValue={value => {
					handleSetToDate(value)
				}}
				value={_toDate}
				format="EEE dd MMM yy"
				openButtonProps={{
					size: 'small',
					variant: 'ghost',
					uppercase: false
				}}
			/>
		</View>
	)
}

export default DateLapse
