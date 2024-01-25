import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputRadios, { InputRadioOption } from './InputRadios'

const InputRadiosFormik = ({
  name,
  options = [],
  label
}: {
  name: string
  options: InputRadioOption[]
  label?: string
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])
  return (
    <InputRadios
      value={value}
      setValue={helpers.setValue}
      options={options}
      label={label}
    />
  )
}

export default InputRadiosFormik
