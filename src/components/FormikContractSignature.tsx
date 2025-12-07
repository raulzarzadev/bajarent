import { useField } from 'formik'
import ErrorBoundary from './ErrorBoundary'
import { InputContractSignatureE } from './InputContractSignature'
const FormikContractSignature = (props?: FormikContractSignatureProps) => {
	const [field, meta, helpers] = useField(props?.name)
	return (
		<InputContractSignatureE
			values={field.value}
			setValues={values => {
				helpers.setValue(values)
			}}
			contractURL={props?.contractURL}
		/>
	)
}
export default FormikContractSignature
export type FormikContractSignatureProps = {
	name: string
	contractURL: string
}
export const FormikContractSignatureE = (props: FormikContractSignatureProps) => (
	<ErrorBoundary componentName="FormikContractSignature">
		<FormikContractSignature {...props} />
	</ErrorBoundary>
)
