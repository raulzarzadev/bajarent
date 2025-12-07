import { useField } from 'formik'
import InputSignature from './InputSignature'

const FormikInputSignature = ({ name, disabled = false }: { name: string; disabled?: boolean }) => {
	const [field, meta, helpers] = useField(name)
	return (
		<InputSignature
			setValue={value => {
				helpers.setValue(value)
			}}
			value={field.value}
			disabled={disabled}
		/>
	)
}

export default FormikInputSignature
