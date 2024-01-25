import { StyleSheet } from 'react-native'
import React from 'react'
import StyledTextInput from './StyledTextInput'
import { useField } from 'formik'

const FormikInputValue = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <StyledTextInput
      value={field.value}
      onChangeText={helpers.setValue}
      {...props}
    />
  )
}

export default FormikInputValue

const styles = StyleSheet.create({})
