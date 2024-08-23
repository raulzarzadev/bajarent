import { StyleSheet, View } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Define el tipo de icono personalizado
const customIcon = L.icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const InputMapLocation = ({
  setLocation,
  location
}: {
  location?: [number, number]
  setLocation?: (coords: [number, number]) => void
}) => {
  const INITIAL_POSITION: [number, number] = location || [
    24.145708, -110.311002
  ]
  const [mapCenter, setMapCenter] = useState(INITIAL_POSITION)

  const handleSetCenter = (center: [number, number]) => {
    setMapCenter(center)
    setLocation?.(center)
  }

  return (
    <View style={{ position: 'relative' }}>
      <View style={styles.container}>
        <MapContainer
          style={styles.map}
          center={mapCenter}
          zoom={16}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker center={mapCenter} setCenter={handleSetCenter} />
        </MapContainer>
      </View>
    </View>
  )
}

function DraggableMarker({
  center,
  setCenter
}: {
  center: [number, number]
  setCenter: (center: [number, number]) => void
}) {
  const [position, setPosition] = useState(center)
  const markerRef = useRef(null)
  const map = useMap()
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current

        if (marker != null) {
          const coords: [number, number] = [
            marker.getLatLng().lat,
            marker.getLatLng().lng
          ]
          setPosition(coords)
          setCenter(coords)
          map.setView(coords)
        }
      }
    }),
    []
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customIcon}
    ></Marker>
  )
}

export default InputMapLocation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: '100%',
    minHeight: 400
  },
  map: {
    width: '100%',
    height: '100%'
  }
})
