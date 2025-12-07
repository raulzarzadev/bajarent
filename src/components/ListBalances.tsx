import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import type { BalanceType } from '../types/BalanceType'
import { ListE } from './List'
import RowBalance from './RowBalace'

const ListBalances = ({ balances }: { balances: BalanceType[] }) => {
	const { navigate } = useNavigation()
	return (
		<View>
			<ListE
				id="list-balances"
				defaultSortBy="createdAt"
				defaultOrder="des"
				onPressRow={id => {
					// @ts-expect-error
					navigate('ScreenBalancesDetails', { id })
				}}
				//TODO:add as side button if its needed
				// onPressNew={() => {
				//   // @ts-expect-error
				//   navigate('ScreenBalancesNew')
				// }}
				sideButtons={[
					{
						icon: 'add',
						label: 'Nuevo',
						onPress: () => {
							// @ts-expect-error
							navigate('ScreenBalancesNew')
						},
						visible: true
					}
				]}
				sortFields={[
					{
						key: 'createdAt',
						label: 'Fecha'
					},
					{
						key: 'fromDate',
						label: 'Desde'
					},
					{
						key: 'toDate',
						label: 'Hasta'
					},
					{
						key: 'type',
						label: 'Tipo'
					},
					{
						key: 'userId',
						label: 'Usuario'
					}
				]}
				data={balances}
				ComponentRow={RowBalance}
				filters={[
					{ field: 'type', label: 'Tipo' },
					{ field: 'userId', label: 'Usuario' }
				]}
			/>
		</View>
	)
}

export default ListBalances
