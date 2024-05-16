import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'

const StoreItems = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ marginTop: 16 }}>
      <Button
        label="Ver ubicaciones"
        onPress={() => {
          // @ts-ignore
          navigate('ScreenItemsMap')
        }}
        icon="location"
        size="small"
      />
    </View>
  )
}

export default StoreItems

const styles = StyleSheet.create({})
