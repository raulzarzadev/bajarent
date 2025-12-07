import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceBalances } from '../firebase/ServiceBalances3'
import asDate from '../libs/utils-date'
import type { StoreBalanceType } from '../types/StoreBalance'
import ButtonConfirm from './ButtonConfirm'
import DateCell from './DateCell'
import DocMetadata from './DocMetadata'
import Icon from './Icon'
import Loading from './Loading'
import { BalanceViewE } from './StoreBalance/BalanceView'

const ScreenBalance_v3 = ({ route }) => {
	const { permissions } = useEmployee()
	const [balance, setBalance] = useState<StoreBalanceType>(null)
	const navigation = useNavigation()
	useEffect(() => {
		const fetchBalance = async () => {
			ServiceBalances.get(route?.params?.id).then(balance => {
				setBalance(balance)
			})
		}
		fetchBalance()
	}, [])

	const handleDelete = async () => {
		await ServiceBalances.delete(balance.id)
		navigation.goBack()
		return
	}

	if (!balance) return <Loading /> //*<-- this should be a loading spinner
	return (
		<ScrollView>
			<DocMetadata item={balance} style={{ flexDirection: 'row', margin: 'auto' }} />
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					width: '100%',
					alignItems: 'center'
				}}
			>
				<DateCell
					date={asDate(balance.fromDate)}
					label="Desde"
					showTime
					showTimeAgo={false}
					labelBold
					showDay
				/>
				<Icon icon="rowRight" />
				<DateCell
					date={asDate(balance.toDate)}
					label="Hasta"
					showTime
					showTimeAgo={false}
					labelBold
					showDay
				/>
			</View>

			<BalanceViewE balance={balance} />
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginVertical: 40
				}}
			>
				<ButtonConfirm
					modalTitle="Eliminar balance"
					handleConfirm={handleDelete}
					openDisabled={!permissions?.isAdmin}
					openSize="xs"
					openLabel="Eliminar"
					openColor="error"
					openVariant="outline"
					icon="delete"
					confirmColor="error"
					confirmLabel="Eliminar"
					confirmVariant="outline"
					confirmIcon="delete"
					text="Se eliminará este balance de forma permanente. ¿Estás seguro?"
				></ButtonConfirm>
			</View>
		</ScrollView>
	)
}

export default ScreenBalance_v3
