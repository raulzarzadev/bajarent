import { useEffect, useState } from 'react'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import type OrderType from '../types/OrderType'

export default function useOrder({ orderId }: { orderId: string }) {
	const [order, setOrder] = useState<OrderType>(null)

	useEffect(() => {
		getFullOrderData(orderId).then(res => {
			setOrder(res)
		})
	}, [orderId])

	return {
		order
	}
}
