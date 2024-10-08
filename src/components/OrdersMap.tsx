import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import React from 'react'
import LinkLocation from './LinkLocation'
import OrderType, { order_status } from '../types/OrderType'
import { MarkerInfo } from './ItemsMap'
import theme, { colors, ORDER_STATUS_COLOR } from '../theme'
import { ModalFilterListE, ModalFilterOrdersProps } from './ModalFilterList'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import dictionary from '../dictionary'
export type MapOrderType = {
  fullName: string
  coords?: [number, number]
  location?: string
  orderId: string
  orderFolio: string | number
  itemNumber: string | number
  itemId: string
  status: keyof typeof order_status
  type: OrderType['type']
}

const OrdersMap = ({ orders }: { orders: MapOrderType[] }) => {
  const INITIAL_POSITION: [number, number] = [24.145708, -110.311002]
  const mapHeight = useWindowDimensions().height
  const headerAndFooterHeight = 220
  const [filteredOrders, setFilteredOrders] = React.useState<MapOrderType[]>([])

  const handleFilter =
    ({ field, value }) =>
    () => {
      setFilteredOrders(orders.filter((order) => order[field] === value))
    }
  const filters: ModalFilterOrdersProps<MapOrderType>['filters'] = [
    {
      field: 'status',
      label: 'Status'
    }
  ]
  return (
    <ScrollView>
      <View
        style={{
          position: 'relative'
        }}
      >
        <MapContainer
          style={{
            width: '100%',
            height: mapHeight - headerAndFooterHeight,
            maxWidth: 1200,
            margin: 'auto'
          }}
          //@ts-ignore
          center={INITIAL_POSITION}
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //@ts-ignore
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredOrders?.map((order) => {
            if (!order.coords) return null
            return (
              <Marker
                key={order.itemId}
                position={order.coords}
                //@ts-ignore
                icon={customSvgIcon(ORDER_STATUS_COLOR[order.status])}
              >
                <Popup>
                  <Text>{order.orderFolio}</Text>
                  <br />
                  <Text>{order.fullName}</Text>
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
                        //@ts-ignore
                        navigate('StackOrders', {
                          screen: 'OrderDetails',
                          params: {
                            orderId: order.itemId
                          }
                        })
                      }}
                      justIcon
                      icon="openEye"
                    ></Button>
                    <LinkLocation location={`${order.coords}`} />
                  </View>
                </Popup>
              </Marker>
            )
          })}

          <View
            style={{
              position: 'absolute',
              zIndex: 9999,
              right: 8,
              top: 8
            }}
          >
            {filters.map((filter) => {
              const markers: MapOrderType['status'][] = orders?.reduce(
                (acc, order) => {
                  if (!acc.includes(order.status)) acc.push(order.status)
                  return acc
                },
                []
              )
              return (
                <View key={filter.label}>
                  <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {filter.label}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {markers.map((marker) => {
                      return (
                        <Pressable
                          key={marker}
                          onPress={handleFilter({
                            field: filter.field,
                            value: marker
                          })}
                        >
                          <MarkerInfo
                            label={dictionary(marker)}
                            color={ORDER_STATUS_COLOR[marker]}
                            key={marker}
                          />
                        </Pressable>
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </View>
        </MapContainer>
        <View style={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
          <ModalFilterListE
            data={orders}
            setData={(orders) => {
              setFilteredOrders(orders)
            }}
            filters={filters}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default OrdersMap
export const OrdersMapE = (props) => (
  <ErrorBoundary componentName="OrdersMap">
    <OrdersMap {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
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
