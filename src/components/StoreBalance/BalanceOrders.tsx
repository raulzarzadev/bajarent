import { limit, orderBy, type QueryConstraint, startAfter, where } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { useShop } from '../../hooks/useShop'
import type OrderType from '../../types/OrderType'
import { order_status } from '../../types/OrderType'
import Button from '../Button'
import { ListOrdersE } from '../ListOrders'

const ORDER_PAGE_SIZE = 20

const searchStatusOptions = {
	[order_status.DELIVERED]: 'Entregadas',
	[order_status.PICKED_UP]: 'Recogidas',
	[order_status.CANCELLED]: 'Canceladas',
	[order_status.CREATED]: 'Creadas'
} as const

type SearchStatusType = keyof typeof searchStatusOptions
type SortField = 'deliveredAt' | 'pickedUpAt' | 'cancelledAt' | 'createdAt'
const getSortField = (status: SearchStatusType): SortField => {
	if (status === order_status.DELIVERED) return 'deliveredAt'
	if (status === order_status.PICKED_UP) return 'pickedUpAt'
	if (status === order_status.CREATED) return 'createdAt'
	if (status === order_status.CANCELLED) return 'cancelledAt'
}

export const BalanceOrders = () => {
	const { shop } = useShop()
	const storeId = shop?.id

	const [status, setStatus] = useState<SearchStatusType>()
	const [orders, setOrders] = useState<OrderType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isPaginating, setIsPaginating] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const lastCursorRef = useRef<any>(null)

	const fetchOrders = useCallback(
		async (mode: 'reset' | 'append' = 'reset') => {
			const isLoadMore = mode === 'append'
			const sortField = getSortField(status)
			isLoadMore ? setIsPaginating(true) : setIsLoading(true)
			if (mode === 'reset') {
				lastCursorRef.current = null
				setHasMore(true)
			}
			setError(null)

			const filters = [] as QueryConstraint[]

			//* ADD QUERY always ask for this shop
			filters.push(where('storeId', '==', storeId))
			//* ADD QUERY In case of ask for more orders
			if (isLoadMore && lastCursorRef.current) {
				filters.push(startAfter(lastCursorRef.current))
			}
			//* ADD QUERY always ask 20 by 20
			filters.push(limit(ORDER_PAGE_SIZE))

			//* ADD QUERY sorting by status depending on the status selected
			filters.push(orderBy(getSortField(status), 'desc'))

			try {
				const result = await ServiceOrders.findMany(filters)
				const lastItem = result[result.length - 1]
				lastCursorRef.current = lastItem?.[sortField] ?? null
				setHasMore(result.length === ORDER_PAGE_SIZE)
				setOrders(prev => (isLoadMore ? [...prev, ...result] : result))
			} catch (err) {
				console.error('Error loading rent orders', err)
				setError('No se pudieron cargar las órdenes. Intenta de nuevo.')
			} finally {
				isLoadMore ? setIsPaginating(false) : setIsLoading(false)
			}
		},
		[storeId, status]
	)

	useEffect(() => {
		if (status === undefined) return
		fetchOrders('reset')
	}, [fetchOrders])

	const handleSelectStatus = (newStatus: SearchStatusType) => {
		if (newStatus === status) {
			fetchOrders('reset')
			return
		}
		setStatus(newStatus)
	}

	const handleLoadMore = () => {
		if (!hasMore || isPaginating || isLoading) return
		fetchOrders('append')
	}

	const isInitialLoading = isLoading && orders.length === 0

	return (
		<View style={{ gap: 12 }}>
			<View
				style={{
					flexDirection: 'row',
					gap: 10,
					justifyContent: 'center'
				}}
			>
				{Object.entries(searchStatusOptions).map(([key, label]) => (
					<Button
						key={key}
						variant={status === key ? 'filled' : 'ghost'}
						size="xs"
						label={label}
						onPress={() => handleSelectStatus(key as SearchStatusType)}
						disabled={isLoading && status === key}
					/>
				))}
			</View>

			{error && <Text style={{ color: '#DC2626', textAlign: 'center' }}>{error}</Text>}

			{isInitialLoading ? (
				<View style={{ paddingVertical: 32 }}>
					<ActivityIndicator />
				</View>
			) : (
				<>
					<ListOrdersE orders={orders} />
					{!orders.length && !error && (
						<Text style={{ textAlign: 'center', color: '#6B7280' }}>
							No hay órdenes para mostrar.
						</Text>
					)}
				</>
			)}
			<View style={{ alignItems: 'center', marginVertical: 12 }}>
				<Button
					size="small"
					icon="rowDown"
					label={hasMore ? (isPaginating ? 'Cargando...' : 'Cargar más') : 'No hay más resultados'}
					variant="outline"
					onPress={handleLoadMore}
					disabled={!hasMore || isPaginating || isInitialLoading || status === undefined}
				/>
			</View>
		</View>
	)
}
