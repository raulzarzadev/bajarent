import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StoreDetails from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'

const ScreenStore = ({ navigation }) => {
  const { store } = useStore()
  if (!store) return <ActivityIndicator />
  return (
    <View>
      <StoreDetails store={store} />
      <Button
        buttonStyles={{
          width: 100,
          margin: 'auto',
          marginVertical: 16
        }}
        onPress={() => {
          navigation.navigate('Staff')
        }}
      >
        Staff
      </Button>
    </View>
  )
}

export default ScreenStore

const styles = StyleSheet.create({})
