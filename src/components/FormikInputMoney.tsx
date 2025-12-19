import { useField } from 'formik'
import InputMoney, { type InputMoneyProps } from './Inputs/InputMoney'

export type FormikInputMoneyProps = Omit<
  InputMoneyProps,
  'value' | 'onChangeValue'
> & {
  name: string
}

/**
 * InputMoney integrado con Formik
 *
 * @example
 * ```tsx
 * <FormikInputMoney
 *   name="amount"
 *   label="Monto"
 *   placeholder="$0.00"
 *   helperText="Ingresa el monto a pagar"
 * />
 * ```
 */
const FormikInputMoney = ({
  name,
  helperText,
  ...props
}: FormikInputMoneyProps) => {
  const [field, meta, helpers] = useField<number>(name)

  return (
    <InputMoney
      value={field.value || 0}
      onChangeValue={(value) => helpers.setValue(value)}
      helperTextColor={meta.touched && meta.error ? 'error' : undefined}
      helperText={(meta.touched && meta.error) || helperText}
      {...props}
    />
  )
}

export default FormikInputMoney
