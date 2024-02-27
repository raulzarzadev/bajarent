import { Linking, StyleSheet, View } from 'react-native'
import React from 'react'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import useLocation from '../hooks/useLocation'

const InputLocation = ({ value, setValue }) => {
  const { locationEnabled } = useLocation()
  return (
    <View style={styles.group}>
      <InputTextStyled
        placeholder="Ubicación"
        value={value}
        onChangeText={setValue}
      />
      <Button
        justIcon
        icon="search"
        variant="ghost"
        onPress={() => {
          Linking.openURL('https://www.google.com/maps')
        }}
      />
      <Button
        justIcon
        icon={locationEnabled ? 'location' : 'locationOff'}
        color={locationEnabled ? 'primary' : 'neutral'}
        variant="ghost"
        onPress={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setValue(
                `${position.coords.latitude},${position.coords.longitude},${position.coords.accuracy}`
              )
              // console.log(position)
            },
            (error) => {
              console.error(error)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          )
        }}
      ></Button>
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
