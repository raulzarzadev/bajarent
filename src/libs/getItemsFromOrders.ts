import type { Timestamp } from 'firebase/firestore'
import type { ItemSelected } from '../components/FormSelectItem'
import type OrderType from '../types/OrderType'

type Item = ItemSelected & {
	id: string
	orderId: string
	orderStatus: OrderType['status']
	deliveredAt: Date | Timestamp
	pickedUpAt: Date | Timestamp
	folio: string
	clientName: string
	orderType: OrderType['type']
}
export type ItemList = Item
export default function getItemsFromOrders({ orders }: { orders: OrderType[] }): ItemList[] {
	const items: Item[] = orders
		.reduce((acc, curr) => {
			//* orders with single item
			const currItem = {
				...curr?.item,
				folio: curr.folio,
				orderId: curr.id,
				orderStatus: curr.status,
				deliveredAt: curr.deliveredAt,
				pickedUpAt: curr.pickedUpAt,
				id: `order-${curr.id}`,
				serial: curr.itemSerial,
				brand: curr.itemBrand,
				clientName: curr.fullName,
				orderType: curr.type
			}
			if (curr.item) {
				return [...acc, currItem]
			}
			// if (curr?.items?.length > 0) {
			//   return [...acc, ...curr.items]
			// }

			return acc
			// if(curr)
		}, [])
		.map(item => ({
			...item,
			orderId: item.orderId,
			orderStatus: item.orderStatus
		}))
	return items
}
