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
          <Button
            justIcon
            icon="search"
            variant="ghost"
            onPress={() => {
              if (value?.startsWith('http')) {
                return Linking.openURL(value)
              }
              return Linking.openURL(`https://www.google.com/maps?q=${value}`)
            }}
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
