import { View, Linking, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Button from './Button'
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'
import theme from '../theme'
import { useEffect, useState } from 'react'
import CoordsType from '../types/CoordsType'
import { getCoordinates } from '../libs/maps'
import Loading from './Loading'
import { gStyles } from '../styles'
import useLocation from '../hooks/useLocation'
import InputMapLocation from './InputMapLocation'

const ModalLocation = (props?: ModalLocationProps) => {
  const location = props?.location
  const modal = useModal({ title: 'Ubicación' })

  const [newLocation, setNewLocation] = useState(location)

  const [coords, setCoords] = useState<CoordsType | null>(undefined)

  useEffect(() => {
    getCoordinates(location).then((coords) => {
      setCoords(coords)
    })
  }, [location])

  const handleUpdateLocation = async () => {
    await props?.setLocation?.(newLocation)
    return
  }
  const handleReset = () => {
    setNewLocation(location)
    getCoordinates(location).then((coords) => {
      setCoords(coords)
    })
  }

  const isDirtyLocation = newLocation !== location
  return (
    <View>
      <Button
        justIcon
        icon="map"
        onPress={modal.toggleOpen}
        variant="ghost"
      ></Button>
      <StyledModal {...modal} size="full">
        <InputMapLocation
          currentCoords={location as CoordsType}
          location={coords}
          setLocation={setNewLocation}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
        {/* <MapLocationE center={location} /> */}
        {/* {edit ? (
          <>
            <InputLocationE
              setValue={setNewLocation}
              value={location}
            ></InputLocationE>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%'
              }}
            >
              <Button
                label="Cancelar"
                onPress={handleEdit}
                size="xs"
                variant="ghost"
                icon="close"
                color="accent"
              ></Button>
              <Button
                label="Guardar"
                onPress={handleUpdateLocation}
                size="xs"
                variant="ghost"
                icon="save"
              ></Button>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%'
              }}
            >
              <Button
                label="Editar"
                onPress={handleEdit}
                size="xs"
                variant="ghost"
                icon="edit"
              ></Button>
              <Button
                label="Abrir en mapa"
                onPress={() => {
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${props.location}`
                  )
                }}
                size="xs"
                variant="ghost"
                icon="map"
                color="success"
              ></Button>
            </View>
            <MapLocationE center={location} />
          </>
        )} */}
      </StyledModal>
    </View>
  )
}
export default ModalLocation
export type ModalLocationProps = {
  location?: CoordsType | string
  setLocation?: (location: CoordsType | string) => Promise<void> | void
}
export const ModalLocationE = (props: ModalLocationProps) => (
  <ErrorBoundary componentName="ModalLocation">
    <ModalLocation {...props} />
  </ErrorBoundary>
)

// export type MapLocationProps = {
//   center: CoordsType | string
// }
// export const MapLocationE = (props: MapLocationProps) => (
//   <ErrorBoundary componentName="MapLocation">
//     <MapLocation {...props} />
//   </ErrorBoundary>
// )
// export const MapLocation = (props: MapLocationProps) => {
//   const center = props?.center
//   const [coords, setCoords] = useState<CoordsType | null>(undefined)
//   useEffect(() => {
//     getCoordinates(center).then((coords) => {
//       setCoords(coords)
//     })
//   }, [center])

//   const { getLocation } = useLocation()

//   useEffect(() => {
//     if (coords === null) {
//       getLocation().then((res) => {
//         setCoords([res.coords.lat, res.coords.lon])
//       })
//     }
//   }, [coords])

//   if (coords === undefined) return <Loading></Loading>
//   if (coords === null)
//     return (
//       <View>
//         <Text style={gStyles.h3}>No hay una ubicación aún</Text>
//       </View>
//     )

//   return (
//     <MapContainer
//       style={{ height: '70vh', width: '100%', minHeight: 400 }}
//       //@ts-ignore
//       center={coords}
//       zoom={13}
//     >
//       <TileLayer
//         //@ts-ignore
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <CircleMarker
//         center={coords}
//         //@ts-ignore
//         radius={10}
//         pathOptions={{
//           color: theme.black,
//           weight: 1,
//           fillColor: 'transparent',
//           fillOpacity: 0.5
//         }}
//       />
//     </MapContainer>
//   )
// }
