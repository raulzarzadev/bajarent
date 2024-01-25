import React, { useMemo } from 'react'
import { useField } from 'formik'
import PhoneInput from './InputPhone'

const InputPhoneFormik = ({ name }) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [])
  return <PhoneInput defaultNumber={value} onChange={helpers.setValue} />
}

export default InputPhoneFormik
