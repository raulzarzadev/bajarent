import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemDetails from '../firebase/ItemDetails'
import Loading from './Loading'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'

const ScreenItemsDetails = ({ route }) => {
  const id = route?.params?.id
  const [item, setItem] = useState(undefined)
  const { items } = useStore()
  useEffect(() => {
    if (items) {
      setItem(items.find((item) => item.id === id) || null)
    }
  }, [route?.params?.id, items])

  if (item === undefined) {
    return <Loading />
  }
  if (item === null) {
    return <Text>Item not found</Text>
  }
  return (
    <View style={gStyles.container}>
      <ItemDetails item={item} />
    </View>
  )
}

export default ScreenItemsDetails
