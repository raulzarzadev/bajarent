import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'

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
