import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MapOrderType, OrdersMapE } from './OrdersMap'
import { useOrdersCtx } from '../contexts/ordersContext'
import { order_status, order_type } from '../types/OrderType'
import unShortUrl from '../libs/unShortUrl'
import extractCoordsFromUrl from '../libs/extractCoordsFromUrl'
import { useEmployee } from '../contexts/employeeContext'

const testOrders: MapOrderType[] = [
	{
		fullName: 'Manuel',
		coords: [24.148708, -110.311002],
		orderId: '1',
		orderFolio: '1',
		itemNumber: '1',
		itemId: '1',
		status: 'REPORTED',
		type: order_type.RENT
	},
	{
		fullName: 'Jorge',
		coords: [24.145708, -110.311002],
		orderId: '2',
		orderFolio: '2',
		itemNumber: '2',
		itemId: '2',
		status: 'DELIVERED',
		type: order_type.RENT
	},
	{
		fullName: 'Maria',
		coords: [24.135708, -110.321002],
		orderId: '3',
		orderFolio: '3',
		itemNumber: '3',
		itemId: '3',
		status: 'PENDING',
		type: order_type.RENT
	},
	{
		fullName: 'Maria',
		coords: [24.135708, -110.300221],
		orderId: '4',
		orderFolio: '4',
		itemNumber: '4',
		itemId: '4',
		status: 'PENDING',
		type: order_type.RENT
	},
	{
		fullName: 'Carlos',
		coords: [24.140155, -110.301002],
		orderId: '5',
		orderFolio: '5',
		itemNumber: '5',
		itemId: '5',
		status: 'REPORTED',
		type: order_type.RENT
	},
	{
		fullName: 'Luis',
		coords: [24.145708, -110.301002],
		orderId: '6',
		orderFolio: '6',
		itemNumber: '6',
		itemId: '6',
		status: 'DELIVERED',
		type: order_type.RENT
	}
]
const StoreTabMap = () => {
	const [orders, setOrders] = useState<MapOrderType[]>([])
	const { orders: consolidated } = useOrdersCtx()
	useEffect(() => {
		const formatted = consolidated
			?.filter(order => {
				//if has location
				//if is delivered
				//if is a rent
				if (order.location && order.type === 'RENT' && order.status === order_status.DELIVERED)
					return true
			})
			// Filter only orders with coords
			?.filter(order => !!order?.coords)
			// Format the orders
			?.map(order => {
				const formatOrder: MapOrderType = {
					fullName: order.fullName,
					coords: order.coords,
					orderId: order.id,
					orderFolio: order.folio,
					itemNumber: order.items[0].number,
					itemId: order.items[0].id,
					status: order.status,
					type: order.type
				}
				return formatOrder
			})
		setOrders(formatted)
	}, [consolidated])
	return (
		<View>
			<OrdersMapE orders={orders} />
		</View>
	)
}

export default StoreTabMap

const styles = StyleSheet.create({})
