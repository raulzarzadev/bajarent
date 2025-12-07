import { useField } from 'formik'
import { useMemo } from 'react'
import ErrorBoundary from './ErrorBoundary'
import PhoneInput from './InputPhone'
export type InputPhoneProps = {
	name: string
	helperText?: string
	label?: string
}
const FormikInputPhone = ({ name, helperText, label }: InputPhoneProps) => {
	const [field, meta, helpers] = useField(name)
	const value = useMemo(() => field?.value, [field?.value])

	return (
		<PhoneInput
			stylesContainer={{ flex: 1, maxWidth: '100%' }}
			label={label}
			defaultNumber={value}
			onChange={value => {
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
