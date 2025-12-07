import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceType2 } from '../types/BalanceType'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import { where } from 'firebase/firestore'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import { BalanceAmountsE } from './BalanceAmounts'
import BusinessStatus from './BusinessStatus'

const ScreenBalancesNew = ({ navigation }) => {
	const { storeId, store, sections: storeSections } = useStore()
	const { user } = useAuth()
	const [balance, setBalance] = React.useState<Partial<BalanceType2>>()

	const getSectionPayments = async ({ section, fromDate, toDate, type }) => {
		/* ******************************************** 
   //* Is necessary get the orders from the section to define section payments           
     *******************************************rz */

		// //* 1.- Filter payments by date from server

		const paymentsByDate = await ServicePayments.findMany([
			where('storeId', '==', storeId),
			where('createdAt', '>=', fromDate),
			where('createdAt', '<=', toDate)
		])
		//* 2.- Find orders from payments, remove duplicates , remove undefined
		const paymentOrders = Array.from(new Set(paymentsByDate.map(p => p.orderId))).filter(o => !!o)
		console.log({ paymentOrders })

		let sectionOrders = []
		if (type === 'partial') {
			sectionOrders =
				(await ServiceOrders.getList(paymentOrders, {
					sections: [section]
				}).catch(e => console.error(e))) || []
		}
		if (type === 'full') {
			sectionOrders =
				(await ServiceOrders.getList(paymentOrders).catch(e => console.error(e))) || []
		}
		//* 3.- Set orders with payments
		const ordersWithPayments = sectionOrders.map(o => {
			const orderPayments = paymentsByDate?.filter(p => p.orderId === o.id)
			return { ...o, payments: orderPayments }
		})

		//* 3.- Need paid orders and payments in dates
		const paidOrders = ordersWithPayments
		const payments = ordersWithPayments.map(o => o.payments).flat()
		return { paidOrders, payments }
	}
	const handleCalculateBalance = async (values: { toDate: Date; fromDate: Date }) => {
		ServiceBalances.createV2(storeId, {
			fromDate: values.fromDate,
			toDate: values.toDate,
			notSave: true,
			storeSections: storeSections.map(s => s.id)
		}).then(res => {
			setBalance(res)
		})
	}

	const handleClear = () => {
		setBalance(undefined)
	}
	if (!storeId || !store || !user) return <Text>Cargando...</Text>
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormBalance onSubmit={handleCalculateBalance} handleClear={handleClear} />
				{balance && (
					<>
						<BalanceAmountsE
							payments={balance?.sections.find(section => section.section === 'all').payments}
						/>
						<BusinessStatus balance={balance} />
					</>
				)}
			</View>
		</ScrollView>
	)
}

export default ScreenBalancesNew

const styles = StyleSheet.create({})
