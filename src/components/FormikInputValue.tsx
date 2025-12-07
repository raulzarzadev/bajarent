import { useField } from 'formik'
import StyledTextInput, { type InputTextProps } from './InputTextStyled'

const FormikInputValue = ({ name, helperText, ...props }: InputTextProps & { name: string }) => {
	const [field, meta, helpers] = useField(name)
	return (
		<StyledTextInput
			value={field?.value}
			onChangeText={text =>
				props.type === 'number' ? helpers.setValue(Number(text)) : helpers.setValue(text)
			}
			helperTextColor={meta.error ? 'error' : undefined}
			helperText={meta.error || helperText}
			{...props}
		/>
	)
}

export default FormikInputValue
