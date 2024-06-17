import { View } from 'react-native'
import React from 'react'
import FormItem from './FormItem'
import { gStyles } from '../styles'
import ItemType from '../types/ItemType'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'

const ScreenItemNew = () => {
  const { goBack } = useNavigation()
  const { storeId } = useStore()
  const handleCreateItem = async (values: ItemType) => {
    goBack()
    // return await ServiceStoreItems.itemCreate(storeId, { item: values })
  }
  return (
    <View style={gStyles.container}>
      <FormItem
        onSubmit={async (values) => {
          return await handleCreateItem(values)
        }}
      />
    </View>
  )
}

export default ScreenItemNew
