import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { gStyles } from '../styles'
import type { BalanceType } from '../types/BalanceType'
import BalanceInfo from './BalanceInfo'
import ButtonConfirm from './ButtonConfirm'

const ScreenBalancesDetails = ({ route, navigation }) => {
	const [balance, setBalance] = React.useState<BalanceType>(null)
	useEffect(() => {
		const fetchBalance = async () => {
			const balance = await ServiceBalances.get(route?.params?.id)
			setBalance(balance)
		}
		fetchBalance()
	}, [])

	if (!balance) return <View /> //*<-- this should be a loading spinner
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<BalanceInfo balance={balance} />
				<View
					style={{
						justifyContent: 'center',
						width: 245,
						margin: 'auto',
						marginVertical: 16
					}}
				>
					<ButtonConfirm
						icon="delete"
						confirmLabel="Eliminar"
						confirmColor="error"
						openVariant="outline"
						openLabel={'Eliminar'}
						openColor="error"
						text="¿Estás seguro de eliminar este balance?"
						handleConfirm={async () => {
							return await ServiceBalances.delete(balance.id).then(() => {
								navigation.goBack()
							})
						}}
					/>
				</View>
			</View>
		</ScrollView>
	)
}

export default ScreenBalancesDetails

const styles = StyleSheet.create({})
