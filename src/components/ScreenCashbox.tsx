import { View } from 'react-native'
import Button from './Button'
import { gSpace } from '../styles'
import { useEmployee } from '../contexts/employeeContext'
import ModalCloseOperations from '../ModalCloseOperations'

const ScreenCashbox = ({ navigation }) => {
	const {
		permissions: { isAdmin, isOwner, store }
	} = useEmployee()
	const canViewBalances = isAdmin || isOwner || store.canViewBalances
	const canCreateBalance = isAdmin || isOwner || store.canCreateBalance
	return (
		<View style={[{ maxWidth: 500, marginHorizontal: 'auto' }]}>
			<View>
				<View style={{ marginVertical: gSpace(2) }}>
					{canCreateBalance && (
						<View style={{ marginVertical: gSpace(2) }}>
							<Button
								label="Nuevo corte"
								onPress={() => {
									navigation.navigate('BalancesNew')
								}}
								icon="add"
							></Button>
						</View>
					)}

					{canViewBalances && (
						<View style={{ marginVertical: gSpace(2) }}>
							<Button
								label="Cortes de caja"
								onPress={() => {
									navigation.navigate('Balances')
								}}
								icon="list"
							></Button>
						</View>
					)}

					<View style={{ marginVertical: gSpace(2) }}>
						<Button
							label="Pagos"
							onPress={() => {
								navigation.navigate('Payments')
							}}
							icon="money"
						></Button>
					</View>
				</View>
			</View>
		</View>
	)
}

export default ScreenCashbox
