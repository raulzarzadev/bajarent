import { useMemo } from 'react'
import { useField } from 'formik'
import InputRadios, { InputRadioOption } from './Inputs/InputRadios'

const FormikInputRadios = ({
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
      onChange={helpers.setValue}
      options={options}
      label={label}
      layout="row"
      disabled={disabled}
    />
  )
}

export default FormikInputRadios
