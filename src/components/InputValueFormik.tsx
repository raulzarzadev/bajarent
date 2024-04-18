import { StyleSheet } from 'react-native'
import React from 'react'
import StyledTextInput, { InputTextProps } from './InputTextStyled'
import { useField } from 'formik'

const InputValueFormik = ({
  name,
  helperText,
  ...props
}: InputTextProps & { name: string }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <StyledTextInput
      value={field.value}
      onChangeText={helpers.setValue}
      helperText={meta.error || helperText}
      {...props}
    />
  )
}

export default InputValueFormik

const styles = StyleSheet.create({})
