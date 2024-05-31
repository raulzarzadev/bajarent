import React, { useMemo } from 'react'
import { useField } from 'formik'
import PhoneInput from './InputPhone'

const FormikInputPhone = ({
  name,
  helperText
}: {
  name: string
  helperText?: string
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [])

  return (
    <PhoneInput
      defaultNumber={value}
      onChange={(value) => {
        if (value === undefined) return helpers.setValue('')
        if (value === 'undefined') return helpers.setValue('')
        helpers.setValue(value)
        helpers.setTouched(true)
      }}
      helperText={meta.error && meta.touched ? meta.error : helperText}
    />
  )
}

export default FormikInputPhone