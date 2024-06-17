import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormItem from './FormItem'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import Loading from './Loading'
import { useNavigation } from '@react-navigation/native'
import { onOverrideItem } from '../libs/item_actions'

const ScreenItemEdit = ({ route }) => {
  const itemId = route?.params?.id
  const { goBack } = useNavigation()
  const { store, storeId } = useStore()
  const items = store?.items
  const [item, setItem] = useState<Partial<ItemType>>()
  useEffect(() => {
    if (items) {
      setItem(items[itemId] || null)
    }
  }, [items])

  const handleUpdateItem = async (values: ItemType) => {
    await onOverrideItem({ storeId, itemId, values })
      .then(console.log)
      .catch(console.error)
  }

  if (item === undefined) return <Loading />

  if (item === null) return <Text>Item not found</Text>
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormItem
          values={item}
          onSubmit={(values) => {
            goBack()
            return handleUpdateItem(values)
          }}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenItemEdit

export const ScreenItemEditE = (props) => (
  <ErrorBoundary componentName="ScreenItemEdit">
    <ScreenItemEdit {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
