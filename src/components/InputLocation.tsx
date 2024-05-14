import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import useLocation from '../hooks/useLocation'

const InputLocation = ({ value, setValue, helperText }) => {
  const { getLocation, loading, location } = useLocation()
  console.log(location?.status)
  return (
    <View style={styles.group}>
      <InputTextStyled
        placeholder="Ubicación"
        value={value}
        onChangeText={setValue}
        helperText={helperText}
        containerStyle={{ flex: 1 }}
      />
      <Button
        justIcon
        icon="search"
        variant="ghost"
        onPress={() => {
          Linking.openURL('https://www.google.com/maps')
        }}
      />
      <View style={{ width: 32, height: 32 }}>
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
        <Text style={{ fontSize: 8 }}>{location?.status}</Text>
      </View>

      {/* {locationEnabled && (
        <Button
          justIcon
          icon={locationEnabled ? 'location' : 'locationOff'}
          color={locationEnabled ? 'primary' : 'neutral'}
          variant="ghost"
          onPress={async () => {
            const position = await askLocation()
            setValue(`${position[0]},${position[1]}`)
            // navigator.geolocation.getCurrentPosition(
            //   (position) => {
            //     setValue(
            //       `${position.coords.latitude},${position.coords.longitude},${position.coords.accuracy}`
            //     )
            //     // console.log(position)
            //   },
            //   (error) => {
            //     console.error(error)
            //   },
            //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            // )
          }}
        ></Button>
      )} */}
    </View>
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
