import { StyleSheet } from 'react-native'
import React from 'react'
import StyledTextInput, { InputTextProps } from './InputTextStyled'
import { useField } from 'formik'

const FormikInputValue = ({
  name,
  helperText,
  ...props
}: InputTextProps & { name: string }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <StyledTextInput
      value={field?.value}
      onChangeText={helpers.setValue}
      helperTextColor={meta.error ? 'error' : undefined}
      helperText={meta.error || helperText}
      {...props}
    />
  )
}

export default FormikInputValue

const styles = StyleSheet.create({})
