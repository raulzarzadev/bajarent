import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { orderExpireAt } from '../libs/orders'
import type OrderType from '../types/OrderType'
import { order_status } from '../types/OrderType'
import ErrorBoundary from './ErrorBoundary'
import { FormOrder2E } from './FormOrder2'

const ScreenOrderRenew = ({ route }) => {
	const orderId = route?.params?.orderId
	const { navigate } = useNavigation()
	const { user } = useAuth()
	const [originalOrder, setOriginalOrder] = useState<OrderType | null>(null)
	useEffect(() => {
		getFullOrderData(orderId).then(order => setOriginalOrder(order))
	}, [orderId])
	const newOrder: Partial<OrderType> = {
		note: originalOrder?.note || '',
		storeId: originalOrder?.storeId || '',
		assignToSection: originalOrder?.assignToSection || '',
		assignToStaff: originalOrder?.assignToStaff || '',
		neighborhood: originalOrder?.neighborhood || '',
		phone: originalOrder?.phone,
		status: order_status.DELIVERED,
		type: originalOrder?.type,
		firstName: originalOrder?.firstName || '',
		lastName: originalOrder?.lastName || '',
		fullName: originalOrder?.fullName || '',
		address: originalOrder?.address || '',
		betweenStreets: originalOrder?.betweenStreets || '',
		location: originalOrder?.location || '',
		email: originalOrder?.email || '',
		description: originalOrder?.description || '',
		imageHouse: originalOrder?.imageHouse || '',
		imageID: originalOrder?.imageID || '',
		indications: originalOrder?.indications || '',
		items: originalOrder?.items || [],
		item: originalOrder?.item || null,
		itemBrand: originalOrder?.itemBrand || '',
		itemSerial: originalOrder?.itemSerial || '',
		street: originalOrder?.street || '',
		expireAt: originalOrder?.expireAt || null,
		statuses: true
	}

	if (!originalOrder) return <ActivityIndicator />

	return (
		<FormOrder2E
			title="Renovación"
			defaultValues={newOrder}
			onSubmit={async order => {
				//   .then(console.log)
				//   .catch(console.error)
				const renewedOrder = {
					...order,
					status: order_status.DELIVERED,
					deliveredAt: order.expireAt,

					// renewedAt: new Date(), // *<--- which order should have this prop? the new one or the original one?
					renewedFrom: orderId
					//renewedBy: user?.id// *<--- which order should have this prop? the new one or the original one?
				}

				//* RENEWED SET EXPIRE DATE WITH THE NEW DELIVERED DATE AT
				const expiredAt = orderExpireAt({ order: renewedOrder })
				renewedOrder.expireAt = expiredAt
				// @ts-expect-error
				return await ServiceOrders.createSerialOrder(renewedOrder)
					.then(async newOrderId => {
						if (newOrderId)
							// @ts-expect-error
							navigate('OrderDetails', { orderId: newOrderId || '' })
						//* update the ORIGINAL order status
						ServiceOrders.update(orderId, {
							status: order_status.RENEWED,
							renewedAt: new Date(), // *<--- which order should have this prop? the new one or the original one?
							renewedTo: newOrderId,
							renewedBy: user?.id // *<--- which order should have this prop? the new one or the original one?
						})

						const newOrder = await ServiceOrders.get(newOrderId)

						// * Add comment to the new order
						ServiceOrders.addComment({
							storeId: order.storeId,
							orderId: newOrderId || '',
							type: 'comment',
							content: `Renovada de ${originalOrder.folio} `
						})
							.then(() => {})
							.catch(console.error)
						// * Add comment to the original order
						ServiceOrders.addComment({
							storeId: order.storeId,
							orderId,
							type: 'comment',
							content: `Renovada con No. ${newOrder?.folio}`
						})
							.then(() => {
								// @ts-expect-error
								navigate('OrderDetails', { orderId: newOrderId || '' })
							})
							.catch(console.error)
					})
					.catch(console.error)
			}}
		/>
	)
}

export const ScreenOrderRenewE = props => (
	<ErrorBoundary componentName="ScreenOrderRenew">
		<ScreenOrderRenew {...props} />
	</ErrorBoundary>
)

export default ScreenOrderRenew
