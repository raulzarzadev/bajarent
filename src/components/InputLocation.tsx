import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import useLocation from '../hooks/useLocation'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import InputMapLocation from './InputMapLocation'

const InputLocation = ({
  value,
  setValue,
  helperText,
  neighborhood,
  address
}: {
  value: string
  setValue: (value: string) => void
  helperText: string
  neighborhood?: string
  address?: string
}) => {
  const { getLocation, loading, location } = useLocation()

  return (
    <View>
      <Text>📍 Ubicación</Text>
      <View style={styles.group}>
        <InputTextStyled
          placeholder="Ubicación"
          value={value}
          onChangeText={setValue}
          helperText={helperText}
          containerStyle={{ flex: 1 }}
        />
        <View style={{ width: 32, height: 32, marginLeft: 4 }}>
          <ModalSelectLocation
            setValue={setValue}
            value={value as `${number},${number}`}
            defaultSearch={
              neighborhood || address
                ? `${address || ''}${neighborhood ? ',' + neighborhood : ''}`
                : ''
            }
          />
        </View>
        <View style={{ width: 32, height: 32, marginLeft: 4 }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              justIcon
              disabled={location?.status === 'denied'}
              icon={'location'}
              variant="ghost"
              onPress={async () => {
                const res = await getLocation()
                if (res?.status === 'granted' && res.coords) {
                  const lat = res?.coords?.lat
                  const lon = res?.coords?.lon
                  setValue(`${lat},${lon}`)
                } else {
                  setValue('')
                }
              }}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const ModalSelectLocation = ({
  setValue,
  value,
  defaultSearch
}: {
  setValue: (location: `${number},${number}`) => void
  value: `${number},${number}`
  defaultSearch: string
}) => {
  const { getLocation, loading, location } = useLocation()
  const modal = useModal({ title: 'Selecciona la ubicación' })
  const coords: [number, number] = useMemo(() => {
    if (value) {
      const [lat, lon] = value.split(',')
      return [Number(lat), Number(lon)]
    }
    return null
  }, [value])

  return (
    <>
      <Button
        justIcon
        //disabled={location?.status === 'denied'}
        icon={'map'}
        variant="ghost"
        onPress={async () => {
          modal.toggleOpen()
          const res = await getLocation()
          if (res?.status === 'granted' && res.coords) {
            const lat = res?.coords?.lat
            const lon = res?.coords?.lon
            setValue(`${lat},${lon}`)
          } else {
            setValue(null)
          }
        }}
      />
      <StyledModal {...modal}>
        <InputMapLocation
          setLocation={(coors: [number, number]) => {
            setValue(`${coors[0]},${coors[1]}`)
          }}
          location={coords}
          defaultSearch={defaultSearch}
        />
        <Button
          label="Cerrar"
          variant="outline"
          onPress={() => {
            modal.toggleOpen()
          }}
        ></Button>
      </StyledModal>
    </>
  )
}

export default InputLocation

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginHorizontal: 10,
    alignItems: 'center'
  }
})
