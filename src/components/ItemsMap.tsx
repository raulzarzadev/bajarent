// App.js
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Icon from './Icon'
import ErrorBoundary from './ErrorBoundary'
import OrderType, { order_status } from '../types/OrderType'
import theme, { colors } from '../theme'
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
const customSvgIcon = (color) =>
  new L.DivIcon({
    html: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill=${color} />
  </svg>`,
    className: 'custom-svg-icon', // Optional: Add a custom class for additional styling
    iconSize: [14, 14], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
  })

export default function ItemsMap({ orders = [] }: ItemsMapProps) {
  const items = formatItemsMaps(orders)
  console.log({ items })
  return (
    <View style={styles.container}>
      <Text>Mapa</Text>
      <MapContainer
        style={styles.map}
        center={INITIAL_POSITION}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {items?.map((item) => {
          return (
            <Marker
              key={item.itemId}
              position={item.coords}
              icon={customSvgIcon(item.iconColor)}
            >
              <Popup>
                <Text>{item.orderFilo}</Text>
                <br />
                <Text>{item.clientName}</Text>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </View>
  )
}
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
    .filter((item) => {
      return isCoordinates(item.coords)
    })
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  map: {
    width: 400,
    height: 400
  }
})
