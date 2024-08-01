import React, { useMemo } from 'react'
import { useField } from 'formik'
import PhoneInput from './InputPhone'
import ErrorBoundary from './ErrorBoundary'
export type InputPhoneProps = {
  name: string
  helperText?: string
  label?: string
}
const FormikInputPhone = ({ name, helperText, label }: InputPhoneProps) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field?.value, [])

  return (
    <PhoneInput
      label={label}
      defaultNumber={value}
      onChange={(value) => {
        if (value === undefined) return helpers.setValue('')
        if (value === 'undefined') return helpers.setValue('')
        helpers.setValue(value)
        helpers.setTouched(true)
      }}
      helperTextColor={meta?.error ? 'error' : undefined}
      helperText={meta?.error && meta?.touched ? meta?.error : helperText}
    />
  )
}
export const FormikInputPhoneE = (props: InputPhoneProps) => (
  <ErrorBoundary componentName="FormikInputPhone">
    <FormikInputPhone {...props} />
  </ErrorBoundary>
)

export default FormikInputPhone
