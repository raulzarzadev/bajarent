import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InputTextStyled from './InputTextStyled'
import Ionicons from '@expo/vector-icons/Ionicons'
import theme from '../theme'

const InputLocation = ({ value, setValue }) => {
  const disabledCurrentLocation = false
  const disabledSearchLocation = false

  return (
    <View style={styles.group}>
      <InputTextStyled
        placeholder="Ubicación"
        value={value}
        onChangeText={setValue}
      />
      <Pressable
        style={[styles.icon, disabledSearchLocation && { opacity: 0.5 }]}
        disabled={disabledSearchLocation}
        onPress={() => {
          Linking.openURL('https://www.google.com/maps')
        }}
      >
        <Ionicons
          name={'locate'}
          color={disabledSearchLocation ? 'gray' : theme.secondary}
          size={30}
        />
      </Pressable>
      <Pressable
        style={[styles.icon, disabledCurrentLocation && { opacity: 0.5 }]}
        disabled={disabledCurrentLocation}
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
      >
        <Ionicons
          disabled={true}
          name={'location'}
          color={disabledCurrentLocation ? 'gray' : theme.secondary}
          size={30}
        />
      </Pressable>
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
