// App.js
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import ErrorBoundary from './ErrorBoundary'
import OrderType, { order_status } from '../types/OrderType'
import theme, { colors } from '../theme'
import LinkLocation from './LinkLocation'
const INITIAL_POSITION = [24.145708, -110.311002]
const LAVARENTA_COORD = [24.150635, -110.316583]
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
  orders: OrderType[]
}
const SvgIcon = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="black"
      strokeWidth="1"
      fill={color}
    />
  </svg>
)
const customSvgIcon = (color) =>
  //@ts-ignore
  new L.DivIcon({
    html: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1" fill=${color} />
  </svg>`,
    className: 'custom-svg-icon', // Optional: Add a custom class for additional styling
    iconSize: [14, 14], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
  })

export default function ItemsMap({ orders = [] }: ItemsMapProps) {
  const items = formatItemsMaps(orders)
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <MarkerInfo label="Vencidas" color={theme.success} />
        <MarkerInfo label="Reportes" color={theme.error} />
        <MarkerInfo label="Pedidos" color={theme.warning} />
        <MarkerInfo label="En renta" color={theme.transparent} />
      </View>
      <MapContainer
        style={styles.map}
        //@ts-ignore
        center={INITIAL_POSITION}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          //@ts-ignore
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {items?.map((item) => {
          return (
            <Marker
              key={item.itemId}
              position={item.coords}
              //@ts-ignore
              icon={customSvgIcon(item.iconColor)}
            >
              <Popup>
                <Text>{item.orderFilo}</Text>
                <br />
                <Text>{item.clientName}</Text>
                <LinkLocation location={`${item.coords}`} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </View>
  )
}
export const MarkerInfo = ({
  label,
  color
}: {
  label: string
  color: string
}) => (
  <View
    style={{
      justifyContent: 'center',
      flexDirection: 'row',
      marginRight: 8,
      marginVertical: 16
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

const isCoordinates = (str: string): boolean => {
  const regex = /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/
  return regex.test(str)
}
const setLocation = (location: string): [number, number] => {
  const isCoords = isCoordinates(location)
  if (isCoords) {
    const coords = location?.split(',')
    return [parseFloat(coords[0]), parseFloat(coords[1])]
  }
  return [0, 0]
}
const formatItemsMaps = (orders: OrderType[]): ItemMap[] =>
  orders
    .filter((item) => {
      return isCoordinates(item.location)
    })
    ?.map((item) => ({
      itemId: item.id,
      clientName: item.fullName,
      orderFilo: item.folio,
      coords: setLocation(item.location),
      label: `${item.folio}`,
      iconColor: (() => {
        if (item.isExpired) return theme.success
        if (item.status === order_status.AUTHORIZED) return theme.warning
        if (item.hasNotSolvedReports) return theme.error
        return colors.transparent
      })()
    }))

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
    height: 400
  }
})
