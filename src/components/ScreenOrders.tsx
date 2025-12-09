import { isToday } from 'date-fns'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import useMyNav from '../hooks/useMyNav'
import useOrders from '../hooks/useOrders'
import { useOrdersRedux } from '../hooks/useOrdersRedux'
import catchError from '../libs/catchError'
import ErrorBoundary from './ErrorBoundary'
import HeaderDate from './HeaderDate'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import { ListOrdersE } from './ListOrders'

function ScreenOrders({ route, navigation: { navigate } }: ScreenOrdersProps) {
	const { store } = useStore() //*<---- FIXME: if you remove this everything will break
	const hasOrderList = !!route?.params?.orders
	const { employee, permissions } = useEmployee()
	const [loading, setLoading] = useState(true)

	const { unsolvedOrders: orders } = useOrdersRedux()
	const { fetchOrders } = useOrders({
		ids: route?.params?.orders
	})

	const [dateOrders, setDateOrders] = useState(null)

	const [preOrders, setPreOrders] = useState([])

	useEffect(() => {
		if (hasOrderList) {
			fetchOrders({ ordersIds: route?.params?.orders })
				.then(res => {
					setDisabled(false)
					setPreOrders(res)
				})
				.catch(error => {
					console.error('Error fetching orders:', error)
					setDisabled(false)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [])

	const [_, setDisabled] = useState(false)

	const viewAllOrders = permissions.orders.canViewAll
	const canViewOtherDates = permissions.orders.canViewOtherDates || permissions.isAdmin
	const userSections = employee?.sectionsAssigned

	const { toMessages } = useMyNav()

	const handleChangeDate = async (date: Date) => {
		if (isToday(date)) {
			return setDateOrders(null)
		}
		setLoading(true)
		const promiseExpires = ServiceOrders.getOrderExpiresOnDate({
			date,
			storeId: store.id
		})
		const promiseScheduled = ServiceOrders.getOrdersScheduledAt({
			date,
			storeId: store.id
		})
		const [err, res] = await catchError(
			Promise.all([promiseExpires, promiseScheduled]).then(([expires, scheduled]) => [
				...expires,
				...scheduled
			])
		)
		setLoading(false)
		if (err) return console.error(err)
		setDateOrders(res)
	}

	const isOtherDateOrders = !(dateOrders === null)

	return (
		<ScrollView>
			{canViewOtherDates && <HeaderDate onChangeDate={handleChangeDate} debounce={700} />}

			{isOtherDateOrders && (
				<ListOrdersE
					loading={loading}
					orders={dateOrders}
					collectionSearch={{
						assignedSections: viewAllOrders ? 'all' : userSections,
						collectionName: 'orders',
						fields: ['folio', 'note', 'fullName', 'name', 'neighborhood', 'status', 'phone']
					}}
					sideButtons={[
						// {
						//   icon: 'refresh',
						//   label: '',
						//   onPress: () => {
						//     handleRefresh()
						//   },
						//   visible: true,
						//   disabled: disabled
						// },
						{
							icon: 'comment',
							label: '',
							onPress: () => {
								toMessages()
							},
							visible:
								store?.chatbot?.enabled &&
								(permissions?.isAdmin || permissions?.store?.canSendMessages)
						},
						{
							icon: 'folderCheck',
							label: 'Trabajo Actual',
							onPress: () => {
								navigate('StackCurrentWork', {
									screen: 'ScreenCurrentWork',
									params: { title: 'Trabajo Actual' }
								})
							},
							visible: true
						}
					]}
				/>
			)}
			{!isOtherDateOrders && (
				<ListOrdersE
					orders={hasOrderList ? preOrders : orders}
					collectionSearch={{
						assignedSections: viewAllOrders ? 'all' : userSections,
						collectionName: 'orders',
						fields: ['folio', 'note', 'fullName', 'name', 'neighborhood', 'status', 'phone']
					}}
					sideButtons={[
						// {
						//   icon: 'refresh',
						//   label: '',
						//   onPress: () => {
						//     handleRefresh()
						//   },
						//   visible: true,
						//   disabled: disabled
						// },
						{
							icon: 'comment',
							label: '',
							onPress: () => {
								toMessages()
							},
							visible:
								store?.chatbot?.enabled &&
								(permissions?.isAdmin || permissions?.store?.canSendMessages)
						},
						{
							icon: 'folderCheck',
							label: 'Trabajo Actual',
							onPress: () => {
								navigate('StackCurrentWork', {
									screen: 'ScreenCurrentWork',
									params: { title: 'Trabajo Actual' }
								})
							},
							visible: true
						}
					]}
				/>
			)}
		</ScrollView>
	)
}

export type ScreenOrdersProps = { route: any; navigation: any }
export const ScreenOrdersE = (props: ScreenOrdersProps) => (
	<ErrorBoundary componentName="ScreenOrders">
		<ScreenOrders {...props} />
	</ErrorBoundary>
)

const ScreenOrdersWithCheck = withDisabledCheck(ScreenOrdersE)
// @ts-expect-error
ScreenOrdersWithCheck.whyDidYouRender = true
export default ScreenOrdersWithCheck
