import { StyleSheet } from 'react-native'
import React from 'react'
import { useField } from 'formik'
import InputLocation from './InputLocation'

const InputLocationFormik = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <InputLocation
      value={field.value}
      setValue={helpers.setValue}
      // {...props}
    />
  )
}

export default InputLocationFormik

const styles = StyleSheet.create({})
