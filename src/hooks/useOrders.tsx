import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'

export default function useOrders({ ids = [] }: { ids: string[] }) {
	const { storeId } = useAuth()

	const fetchOrders = async ({ ordersIds }) => {
		try {
			const reports = await ServiceComments.getReportsUnsolved(storeId)
			const promises = ordersIds?.map(async id => {
				const order = await ServiceOrders.get(id)
				return order
			})
			const res = await Promise.all(promises)
			const formattedOrders = formatOrders({ orders: res, reports })
			return formattedOrders
		} catch (e) {
			console.error({ e })
		}
	}

	return {
		fetchOrders
	}
}
