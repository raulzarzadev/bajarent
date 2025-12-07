import { Pressable, Text, View } from 'react-native'
import { useEmployee } from '../../contexts/employeeContext'
import { useStore } from '../../contexts/storeContext'
import useMyNav from '../../hooks/useMyNav'
import asDate, { dateFormat } from '../../libs/utils-date'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { gStyles } from '../../styles'
import theme from '../../theme'
import { StaffName } from '../CardStaff'
import ErrorBoundary from '../ErrorBoundary'
import Icon from '../Icon'
import List from '../List'
import type { CurrentWorkUpdate } from './CurrentWorkType'

const CurrentWorkList = () => {
	const { data } = useCurrentWork()
	const { staff } = useStore()
	const { toOrders, toPayments } = useMyNav()
	const {
		permissions: { isAdmin }
	} = useEmployee()

	type CurrentWorkUpdateStaffName = CurrentWorkUpdate & {
		createdByName: string
	}
	const currentWorks: CurrentWorkUpdateStaffName[] = Object.entries(data?.updates || {}).map(
		([id, value]) => {
			const createdByName = staff.find(s => s.userId === value.createdBy)?.name
			return { id, ...value, createdByName }
		}
	)

	if (!isAdmin) return null
	if (currentWorks?.length === 0) return null
	return (
		<View>
			<Text style={gStyles.h2}>Trabajo actual</Text>
			<List
				id="current-work-list"
				data={currentWorks}
				filters={[
					{
						field: 'createdByName',
						label: 'Creado por: ',
						icon: 'profile'
					}
				]}
				sortFields={[
					{
						key: 'createdAt',
						label: 'Fecha'
					},
					{
						key: 'createdBy',
						label: 'Staff'
					}
				]}
				defaultSortBy="createdAt"
				defaultOrder="des"
				ComponentRow={({ item }) => {
					return (
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ marginHorizontal: 6 }}>
								{dateFormat(asDate(item.createdAt), 'dd/MM/yy HH:mm:ss')}
							</Text>
							{<StaffName userId={item?.createdBy} />}
							<Text style={{ marginHorizontal: 6 }}>{item.type}</Text>
							<Text style={{ marginHorizontal: 6 }}>{item.action}</Text>
							{item?.type === 'order' && (
								<Pressable onPress={() => toOrders({ id: item?.details?.orderId })}>
									<Icon icon="openEye" size={12} color={theme.primary} />
								</Pressable>
							)}
							{item?.type === 'payment' && (
								<Pressable onPress={() => toPayments({ id: item?.details?.paymentId })}>
									<Icon icon="openEye" size={12} color={theme.primary} />
								</Pressable>
							)}
						</View>
					)
				}}
			></List>
		</View>
	)
}
export default CurrentWorkList

export const CurrentWorkListE = () => (
	<ErrorBoundary componentName="CurrentWorkList">
		<CurrentWorkList />
	</ErrorBoundary>
)
