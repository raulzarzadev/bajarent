import { View, Text } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'

const ListItemsSections = () => {
  const { storeId, items } = useStore()
  console.log({ items })
  return (
    <View>
      <Text>ListItemsSections</Text>
    </View>
  )
}

export default ListItemsSections
