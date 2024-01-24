import { StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { useField } from 'formik'
import PhoneInput from './PhoneInput'

const FormikInputPhone = ({ name }) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [])
  return <PhoneInput defaultNumber={value} onChange={helpers.setValue} />
}

export default FormikInputPhone

const styles = StyleSheet.create({})
