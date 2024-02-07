import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormCategory from './FormCategory'
import { gStyles } from '../styles'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { useStore } from '../contexts/storeContext'

const ScreenCategoryNew = ({ navigation }) => {
  const { store, getCategories } = useStore()
  return (
    <View style={gStyles.container}>
      <FormCategory
        onSubmit={async (values) => {
          values.storeId = store.id
          await ServiceCategories.create(values)
            .then((r) => {
              console.log(r)
              getCategories()
            })
            .catch((e) => console.error(e))

          navigation.goBack()
        }}
      />
    </View>
  )
}

export default ScreenCategoryNew

const styles = StyleSheet.create({})
