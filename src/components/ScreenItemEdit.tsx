import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormItem from './FormItem'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import Loading from './Loading'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'

const ScreenItemEdit = ({ route }) => {
  const itemId = route?.params?.id
  const { store, storeId } = useStore()
  const items = store?.items
  const [item, setItem] = useState<Partial<ItemType>>()
  useEffect(() => {
    if (items) {
      setItem(items[itemId] || null)
    }
  }, [items])

  const handleUpdateItem = async (values: ItemType) => {
    return ServiceStoreItems.itemUpdate(storeId, itemId, values)
  }

  if (item === undefined) return <Loading />

  if (item === null) return <Text>Item not found</Text>
  return (
    <View style={gStyles.container}>
      <FormItem
        values={item}
        onSubmit={(values) => {
          return handleUpdateItem(values)
        }}
      />
    </View>
  )
}

export default ScreenItemEdit

export const ScreenItemEditE = (props) => (
  <ErrorBoundary componentName="ScreenItemEdit">
    <ScreenItemEdit {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
