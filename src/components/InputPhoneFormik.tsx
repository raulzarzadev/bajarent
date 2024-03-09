import React, { useMemo } from 'react'
import { useField } from 'formik'
import PhoneInput from './InputPhone'

const InputPhoneFormik = ({ name }) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [])
  return (
    <PhoneInput
      defaultNumber={value}
      onChange={(value) => {
        if (value === undefined) return helpers.setValue('')
        if (value === 'undefined') return helpers.setValue('')
        helpers.setValue(value)
      }}
    />
  )
}

export default InputPhoneFormik
