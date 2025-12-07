import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import { gStyles } from '../styles'
import type { BalanceType2 } from '../types/BalanceType'
import { BalanceAmountsE } from './BalanceAmounts'
import BusinessStatus from './BusinessStatus'
import FormBalance from './FormBalance'

const ScreenBalancesNew = () => {
	const { storeId, store, sections: storeSections } = useStore()
	const { user } = useAuth()
	const [balance, setBalance] = useState<Partial<BalanceType2>>()

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
