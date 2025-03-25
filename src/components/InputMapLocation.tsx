import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  useMap
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import InputTextStyled from './InputTextStyled'
import useDebounce from '../hooks/useDebunce'
import Button from './Button'
import useLocation from '../hooks/useLocation'
import CoordsType from '../types/CoordsType'
import Loading from './Loading'
import theme from '../theme'

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
  setCoords,
  coords,
  defaultCoords,
  defaultSearch
}: {
  coords?: CoordsType
  defaultCoords?: CoordsType
  setCoords?: (coords: CoordsType) => void | Promise<void>
  defaultSearch?: string
}) => {
  const INITIAL_POSITION: CoordsType = defaultCoords || [24.145708, -110.311002]
  const [mapCenter, setMapCenter] = useState(INITIAL_POSITION)
  const [mapZoom, setMapZoom] = useState(16)
  const handleSetCenter = (center: CoordsType) => {
    setMapCenter(center)
  }

  const handleUpdateLocation = async () => {
    await setCoords?.(mapCenter)
    return
  }
  const handleReset = () => {
    setMapCenter(defaultCoords || INITIAL_POSITION)
  }

  const isDirtyLocation =
    JSON.stringify(mapCenter) !== JSON.stringify(defaultCoords)
  const INPUT_HEIGHT = 40

  return (
    <View>
      <View style={{ position: 'relative', marginTop: INPUT_HEIGHT }}>
        <View style={styles.container}>
          <MapContainer
            style={styles.map}
            //@ts-ignore
            center={mapCenter}
            zoom={mapZoom}
            key={mapCenter.toString()}
          >
            <TileLayer
              //@ts-ignore
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {defaultCoords && (
              <CircleMarker
                center={defaultCoords}
                //@ts-ignore
                radius={10}
                pathOptions={{
                  color: theme.primary,
                  weight: 2,
                  fillColor: theme.primary,
                  fillOpacity: 0.5
                }}
              />
            )}
            <DraggableMarker center={mapCenter} setCenter={handleSetCenter} />
            <MapCenterTracker
              onCenterChange={(center) => {
                handleSetCenter(center)
              }}
            />
            <MapZoomTracker
              onZoomChange={(zoom) => {
                setMapZoom(zoom)
              }}
            />
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
            defaultSearch={defaultSearch}
            setCoords={(coords) => {
              handleSetCenter(coords)
            }}
            coords={mapCenter}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 8
        }}
      >
        <Button
          onPress={handleReset}
          label="Restablecer"
          icon="refresh"
          size="xs"
          variant="ghost"
          disabled={!isDirtyLocation}
        ></Button>
        <Button
          onPress={handleUpdateLocation}
          label="Actualizar ubicación"
          icon="save"
          disabled={!isDirtyLocation}
          size="xs"
          color={isDirtyLocation ? 'success' : 'transparent'}
        ></Button>
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
  setCoords,
  maxResults = 6,
  defaultSearch,
  coords
}: {
  setOptions?: (options: NominatimResult[]) => void
  setCoords?: (coords: CoordsType) => void
  maxResults?: number
  defaultSearch?: string
  coords?: CoordsType
}) => {
  const [loading, setLoading] = useState(false)
  const { location, getLocation } = useLocation()
  const [searchQuery, setSearchQuery] = useState(defaultSearch)
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
        const newCenter: CoordsType = [parseFloat(lat), parseFloat(lon)]
        // setCoords(newCenter)
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 4
        }}
      >
        {!!coords && (
          <Button
            // label="Ir"
            size="small"
            variant="ghost"
            icon="navigate"
            color="success"
            onPress={() => {
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${coords}`
              )
            }}
          />
        )}
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
        {loading ? (
          <Loading />
        ) : (
          <Button
            justIcon
            disabled={location?.status === 'denied'}
            icon={'target'}
            variant="ghost"
            onPress={async () => {
              setLoading(true)
              const res = await getLocation()
              if (res?.status === 'granted' && res.coords) {
                const lat = res?.coords?.lat
                const lon = res?.coords?.lon
                setCoords([lat, lon])
              } else {
                setCoords(null)
              }
              setLoading(false)
            }}
          />
        )}
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
                  const newCenter: CoordsType = [
                    parseFloat(response.lat),
                    parseFloat(response.lon)
                  ]
                  setCoords(newCenter)
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
  center: CoordsType
  setCenter: (center: CoordsType) => void
}) {
  const [position, setPosition] = useState(center)
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current

        if (marker !== null) {
          const coords: CoordsType = [
            marker.getLatLng()?.lat,
            marker.getLatLng()?.lng
          ]
          setPosition(coords)
          setCenter(coords)
        }
      }
    }),
    []
  )

  return (
    <Marker
      //@ts-ignore
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
    minHeight: 300
  },
  map: {
    width: '100%',
    height: '100%'
  }
})

function MapCenterTracker({
  onCenterChange
}: {
  onCenterChange: (center: CoordsType) => void
}) {
  const map = useMap()

  // Este efecto se ejecuta cuando el mapa se mueve
  useEffect(() => {
    if (!map) return

    const updateCenter = () => {
      const center = map.getCenter()
      const newCenter: CoordsType = [center.lat, center.lng]
      onCenterChange(newCenter)
    }

    map.on('moveend', updateCenter)
    // También puedes detectar otros eventos como 'zoom', 'drag', etc.

    return () => {
      map.off('moveend', updateCenter)
    }
  }, [map, onCenterChange])

  return null // Este componente no renderiza nada
}

function MapZoomTracker({
  onZoomChange
}: {
  onZoomChange: (zoom: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const updateZoom = () => {
      const currentZoom = map.getZoom()
      onZoomChange(currentZoom)
    }

    // También puedes escuchar 'zoom' para actualizaciones en tiempo real
    map.on('zoomend', updateZoom)

    return () => {
      map.off('zoomend', updateZoom)
    }
  }, [map, onZoomChange])

  return null
}
