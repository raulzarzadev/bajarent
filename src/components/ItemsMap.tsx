// App.js
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { StyleSheet, Text, View } from 'react-native'
import 'leaflet/dist/leaflet.css'
import { useNavigation } from '@react-navigation/native'
import { formatItemsMaps } from '../libs/maps'
import theme from '../theme'
import type OrderType from '../types/OrderType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import LinkLocation from './LinkLocation'

const INITIAL_POSITION = [24.145708, -110.311002]

export type ItemMap = {
	itemId: string
	clientName: string
	orderFilo: number
	coords: [number, number]
	label: string
	iconColor: string
}
export type ItemsMapProps = {
	//items: ItemMap[]
	orders?: Partial<OrderType>[]
	items?: ItemMap[]
}
const SvgIcon = ({ color }) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: no entiendo por que es necesario y no lo tiene como props
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1" fill={color} />
	</svg>
)
const customSvgIcon = color =>
	//@ts-expect-error
	new L.DivIcon({
		html: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1" fill=${color} />
  </svg>`,
		className: 'custom-svg-icon', // Optional: Add a custom class for additional styling
		iconSize: [14, 14], // size of the icon
		iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
		popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
	})

export default function ItemsMap({ orders = [], items = [] }: ItemsMapProps) {
	const { navigate } = useNavigation()
	const [_items, _setItems] = useState([])
	useEffect(() => {
		if (orders?.length > 0) {
			formatItemsMaps(orders).then(res => {
				_setItems(res)
			})
		} else if (items?.length > 0) {
			_setItems(items)
		}
	}, [orders])

	return (
		<View
			style={{
				position: 'relative'
			}}
		>
			<MapContainer
				style={styles.map}
				//@ts-expect-error
				center={INITIAL_POSITION}
				zoom={12}
				scrollWheelZoom={false}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					//@ts-expect-error
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>

				{_items?.map(item => {
					if (!item.coords) return null
					return (
						<Marker
							key={item.itemId}
							position={item.coords}
							//@ts-expect-error
							icon={customSvgIcon(item.iconColor)}
						>
							<Popup>
								<Text>{item.orderFilo}</Text>
								<br />
								<Text>{item.clientName}</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<Button
										variant="ghost"
										label={'ver'}
										onPress={() => {
											//@ts-expect-error
											navigate('StackOrders', {
												screen: 'OrderDetails',
												params: {
													orderId: item.itemId
												}
											})
										}}
										justIcon
										icon="openEye"
									></Button>
									<LinkLocation location={`${item.coords}`} />
								</View>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
			<View
				style={{
					flexDirection: 'row',
					position: 'absolute',
					zIndex: 9999,
					right: 16
				}}
			>
				<MarkerInfo label="Vencidas" color={theme.success} />
				<MarkerInfo label="Reportes" color={theme.error} />
				<MarkerInfo label="Pedidos" color={theme.warning} />
				<MarkerInfo label="En renta" color={theme.transparent} />
			</View>
		</View>
	)
}
export const MarkerInfo = ({ label, color }: { label: string; color: string }) => (
	<View
		style={{
			justifyContent: 'center',
			flexDirection: 'row',
			marginLeft: 4,
			marginVertical: 4
		}}
	>
		<Text>{label}</Text>
		<SvgIcon color={color} />
	</View>
)
export const ItemMapE = (props: ItemsMapProps) => {
	return (
		<ErrorBoundary componentName="Map">
			<ItemsMap {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 'auto',
		width: '100%'
	},
	map: {
		width: '100%',
		//height: 700,
		//height: '100vh',
		height: '100%',

		maxWidth: 1200,
		margin: 'auto',
		aspectRatio: 16 / 12
	}
})
