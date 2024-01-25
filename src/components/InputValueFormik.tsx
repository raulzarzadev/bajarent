import { StyleSheet } from 'react-native'
import React from 'react'
import StyledTextInput from './InputTextStyled'
import { useField } from 'formik'

const InputValueFormik = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <StyledTextInput
      value={field.value}
      onChangeText={helpers.setValue}
      {...props}
    />
  )
}

export default InputValueFormik

const styles = StyleSheet.create({})
