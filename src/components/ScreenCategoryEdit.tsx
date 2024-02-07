import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormCategory from './FormCategory'
import { gStyles } from '../styles'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { useStore } from '../contexts/storeContext'

const ScreenCategoryEdit = ({ navigation, route }) => {
  const { categories, getCategories } = useStore()
  const { categoryId } = route.params
  const category = categories?.find((c) => c.id === categoryId)
  return (
    <View style={gStyles.container}>
      <FormCategory
        defaultValues={category}
        onSubmit={async (values) => {
          await ServiceCategories.update(categoryId, values)
            .then((r) => {
              getCategories()
              console.log(r)
            })
            .catch((e) => console.error(e))

          navigation.goBack()
        }}
      />
    </View>
  )
}

export default ScreenCategoryEdit

const styles = StyleSheet.create({})
