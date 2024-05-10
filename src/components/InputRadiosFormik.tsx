import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputRadios, { InputRadioOption } from './InputRadios'

const InputRadiosFormik = ({
  name,
  options = [],
  label,
  disabled
}: {
  name: string
  options: InputRadioOption[]
  label?: string
  disabled?: boolean
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])

  return (
    <InputRadios
      value={value}
      setValue={helpers.setValue}
      options={options}
      label={label}
      layout="row"
      disabled={disabled}
    />
  )
}

export default InputRadiosFormik
