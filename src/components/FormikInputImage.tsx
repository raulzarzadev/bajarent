import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputImagePicker from './InputImagePicker'

const FormikInputImage = ({
  name,
  label
}: {
  name: string
  label?: string
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])

  return (
    <InputImagePicker
      name={name}
      label={label}
      value={value}
      setValue={helpers.setValue}
    />
  )
}

export default FormikInputImage
