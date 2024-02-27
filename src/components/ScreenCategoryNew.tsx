import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormCategory from './FormCategory'
import { gStyles } from '../styles'
import useCategories from '../hooks/useCategories'
import { useStore } from '../contexts/storeContext'

const ScreenCategoryNew = ({ navigation }) => {
  const { createCategory } = useCategories()
  const { updateCategories } = useStore()
  return (
    <View style={gStyles.container}>
      <FormCategory
        onSubmit={async (values) => {
          await createCategory(values)
          updateCategories()
          navigation.goBack()
        }}
      />
    </View>
  )
}

export default ScreenCategoryNew

const styles = StyleSheet.create({})
