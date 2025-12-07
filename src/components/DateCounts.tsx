import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { ServicePayments } from '../firebase/ServicePayments'
import { endDate, startDate } from '../libs/utils-date'
import { gStyles } from '../styles'
import type PaymentType from '../types/PaymentType'
import BalanceAmounts from './BalanceAmounts'

const DateCounts = ({ date }: { date: Date }) => {
	const [payments, setPayments] = useState<PaymentType[]>([])

	const { storeId, staff } = useStore()
	const {
		permissions: { isAdmin, isOwner }
	} = useEmployee()

	useEffect(() => {
		ServicePayments.getBetweenDates({
			fromDate: startDate(date),
			toDate: endDate(date),
			storeId
		}).then(setPayments)
	}, [date])

	//* If the user is NOT an admin or owner, return null
	if (!(isAdmin || isOwner)) return null
	return (
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'space-around'
			}}
		>
			<View style={{ marginVertical: 4 }}>
				<Text style={gStyles.h3}>Todos</Text>
				<BalanceAmounts payments={payments} />
			</View>
			{staff.map(({ userId, position, name }) => {
				const userPayments = payments?.filter(p => p?.createdBy === userId)
				if (userPayments.length === 0) return null
				return (
					<View key={userId} style={{ marginVertical: 4 }}>
						<Text style={gStyles.h3}>{position || name}</Text>
						<BalanceAmounts payments={userPayments} />
					</View>
				)
			})}
		</View>
	)
}

export default DateCounts
