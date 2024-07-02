import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormItem from './FormItem'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import Loading from './Loading'
import { useNavigation } from '@react-navigation/native'
import { onUpdateItem } from '../firebase/actions/item-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'

const ScreenItemEdit = ({ route }) => {
  const itemId = route?.params?.id
  const { goBack } = useNavigation()
  const { storeId, items, fetchItems } = useStore()
  const [item, setItem] = useState<Partial<ItemType>>()
  useEffect(() => {
    if (items) {
      ServiceStoreItems.get({ storeId, itemId }).then((res) => {
        setItem(res)
      })
    }
  }, [items])

  const handleUpdateItem = async (values: ItemType) => {
    return await onUpdateItem({ storeId, itemId, values })
      .then((res) => {
        console.log({ res })
      })
      .catch((e) => {
        console.log({ e })
      })
  }
  if (item === undefined) return <Loading />

  if (item === null) return <Text>Item not found</Text>
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormItem
          values={item}
          onSubmit={async (values) => {
            await handleUpdateItem(values)
            fetchItems()
            goBack()
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
