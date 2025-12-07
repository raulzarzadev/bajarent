import { useField } from 'formik'
import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { InputDocumentPickerE } from './InputDocumentPicker'

const FormikDocumentPicker = (props?: FormikDocumentPickerProps) => {
	const [field, _, helpers] = useField(props.name)
	return (
		<View>
			<InputDocumentPickerE
				name="file"
				// label="Contrato del cliente"
				value={field.value}
				setValue={value => {
					helpers.setValue(value)
				}}
				fileName={props?.fieldName}
				mimeTypes={['application/pdf']} // Solo PDFs
				onUploading={progress => console.log('Progreso:', progress)}
			/>
		</View>
	)
}
export default FormikDocumentPicker
export type FormikDocumentPickerProps = { name: string; fieldName: string }
export const FormikDocumentPickerE = (props: FormikDocumentPickerProps) => (
	<ErrorBoundary componentName="FormikDocumentPicker">
		<FormikDocumentPicker {...props} />
	</ErrorBoundary>
)
