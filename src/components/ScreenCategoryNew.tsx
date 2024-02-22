import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormCategory from './FormCategory'
import { gStyles } from '../styles'
import useCategories from '../hooks/useCategories'

const ScreenCategoryNew = ({ navigation }) => {
  const { createCategory } = useCategories()
  return (
    <View style={gStyles.container}>
      <FormCategory
        onSubmit={async (values) => {
          await createCategory(values)
          navigation.goBack()
        }}
      />
    </View>
  )
}

export default ScreenCategoryNew

const styles = StyleSheet.create({})
