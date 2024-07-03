import { View } from 'react-native'
import React from 'react'
import FormItem from './FormItem'
import { gStyles } from '../styles'
import ItemType from '../types/ItemType'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import { onCreateItem } from '../firebase/actions/item-actions'

const ScreenItemNew = () => {
  const { goBack } = useNavigation()
  const { storeId, fetchItems } = useStore()
  const handleCreateItem = async (values: ItemType) => {
    return await onCreateItem({ storeId, item: values })
      .then((res) => {
        fetchItems()
        console.log({ res })
        goBack()
      })
      .catch((err) => {
        console.log({ err })
      })
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
