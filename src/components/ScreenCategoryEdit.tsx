import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormCategory from './FormCategory'
import { gStyles } from '../styles'
import useCategories from '../hooks/useCategories'

const ScreenCategoryEdit = ({ navigation, route }) => {
  const categoryId = route.params.id
  const { getCategory, updateCategory } = useCategories()
  const category = getCategory(categoryId)
  if (!category) return null
  return (
    <View style={gStyles.container}>
      <FormCategory
        defaultValues={category}
        onSubmit={async (values) => {
          await updateCategory(categoryId, values)
          navigation.goBack()
        }}
      />
    </View>
  )
}

export default ScreenCategoryEdit

const styles = StyleSheet.create({})
