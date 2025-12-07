import { isAfter, isBefore } from 'date-fns'
import { orderExpireAt } from '../../../libs/orders'
import asDate from '../../../libs/utils-date'
import type OrderType from '../../../types/OrderType'

export const handleSetStatuses = ({
	order
}: {
	order: Partial<OrderType>
}): {
	order: Partial<OrderType>
	statuses: {
		isExpired: boolean
		isDelivered?: boolean
		isAuthorized?: boolean
	}
} => {
	const expireAt = orderExpireAt({ order })

	const isDelivered = order?.status === 'DELIVERED'
	const isAuthorized = order?.status === 'AUTHORIZED'
	order = {
		...order,
		expireAt: asDate(expireAt)
	}
	return {
		order,
		statuses: {
			isExpired: !!expireAt && isAfter(new Date(), expireAt),
			isDelivered,
			isAuthorized
		}
	}
}
