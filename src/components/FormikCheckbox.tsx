import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputCheckbox from './InputCheckbox'

const FormikCheckbox = ({ name, label }: { name: string; label?: string }) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])

  return (
    <InputCheckbox
      label={label}
      setValue={(isChecked: boolean) => {
        helpers.setValue(isChecked)
      }}
      value={value}
    />
  )
}

export default FormikCheckbox
