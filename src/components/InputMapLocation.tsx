import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import useDebounce from '../hooks/useDebunce'
import { set } from 'cypress/types/lodash'

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

  const INPUT_HEIGHT = 40

  return (
    <View>
      <View style={{ position: 'relative', marginTop: INPUT_HEIGHT }}>
        <View style={styles.container}>
          <MapContainer
            style={styles.map}
            center={mapCenter}
            zoom={16}
            key={mapCenter.toString()}
            // scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker center={mapCenter} setCenter={handleSetCenter} />
          </MapContainer>
        </View>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            zIndex: 9999,
            top: -INPUT_HEIGHT,
            right: 0,
            left: 0,
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          <SearchAddressLocation
            setLocation={(coords) => {
              handleSetCenter(coords)
            }}
          />
        </View>
      </View>
    </View>
  )
}

interface NominatimResult {
  place_id: number
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  address: {
    city?: string
    [key: string]: string | undefined
  }
  licence: string
}
const SearchAddressLocation = ({
  setOptions,
  setLocation,
  maxResults = 6
}: {
  setOptions?: (options: NominatimResult[]) => void
  setLocation?: (coords: [number, number]) => void
  maxResults?: number
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [responses, setResponses] = useState(undefined)

  const [showResponses, setShowResponses] = useState(false)

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      )
      const data = await response.json()
      const slicedResult = data.slice(0, maxResults)
      setResponses(slicedResult)
      if (data.length > 0) {
        setShowResponses(true)

        setOptions?.(slicedResult)
        const { lat, lon } = data[0]
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)]
        // setLocation(newCenter)
      } else {
        // alert('No se encontraron resultados')
        setResponses([])
      }
    } catch (error) {
      console.error(error)
      setResponses(-1)
      //  alert('Error al buscar la dirección')
    }
  }
  const debouncedSearch = useDebounce(searchQuery, 500)
  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <View style={{ position: 'relative', width: '100%' }}>
      <View style={{ flexDirection: 'row' }}>
        <InputTextStyled
          containerStyle={{ flex: 1 }}
          onChangeText={(text) => {
            if (text === '') {
              setShowResponses(false)
              setResponses(undefined)
            }
            setSearchQuery(text)
          }}
          value={searchQuery}
          placeholder="Buscar dirección "
          innerLeftIcon={searchQuery ? 'close' : 'search'}
          onLeftIconPress={() => {
            if (searchQuery) {
              setSearchQuery('')
              setShowResponses(false)
            } else {
              // alert('Buscar')
            }
          }}
        />
      </View>
      <View style={{ zIndex: 99999999 }}>
        {responses === -1 && <Text>Error al buscar la dirección</Text>}
        {responses?.length === 0 && (
          <Text>No se encontraron coincidencias</Text>
        )}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white'
          }}
        >
          {showResponses &&
            responses?.map((response: NominatimResult) => (
              <Pressable
                style={{ padding: 4, marginVertical: 4 }}
                key={response.place_id}
                onPress={() => {
                  const newCenter: [number, number] = [
                    parseFloat(response.lat),
                    parseFloat(response.lon)
                  ]
                  setLocation(newCenter)
                  setShowResponses(false)
                }}
              >
                <Text>{response.display_name}</Text>
              </Pressable>
            ))}
        </View>
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
