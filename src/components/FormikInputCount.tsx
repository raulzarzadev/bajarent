import { useField } from 'formik'
import ErrorBoundary from './ErrorBoundary'
import InputCount from './InputCount'

export type FormikInputCountProps = {
  name: string
  disabled?: boolean
  label?: string
}
export const FormikInputCount = (props: FormikInputCountProps) => {
  const { name, disabled, label } = props
  const [field, _, helpers] = useField(name)

  return (
    <InputCount
      disabled={disabled}
      setValue={helpers.setValue}
      value={field.value}
      label={label}
    />
  )
}

export const FormikInputCountE = (props: FormikInputCountProps) => (
  <ErrorBoundary componentName="FormikInputCount">
    <FormikInputCount {...props} />
  </ErrorBoundary>
)
