import { Formik } from 'formik'

import { StyleSheet, Text, View } from 'react-native'
import type { ClientType } from '../types/ClientType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import { FormikInputPhoneE } from './FormikInputPhone'
import FormikInputValue from './FormikInputValue'
export type FormCLientProps = {
	client?: Partial<ClientType>
	onSubmit: (values: Partial<ClientType>) => void | Promise<void>
}
const FormClient = ({ client, onSubmit }: FormCLientProps) => {
	const clientDefault: Partial<ClientType> = {
		name: '',
		phone: '',
		neighborhood: '',
		address: '',
		...client
	}
	const [loading, setLoading] = useState(false)
	return (
		<View>
			<Formik
				onSubmit={async values => {
					setLoading(true)
					await onSubmit(values)
					setLoading(false)
				}}
				initialValues={clientDefault}
			>
				{({ handleSubmit }) => {
					return (
						<View>
							<FormikInputValue name="name" label="Nombre" />
							<FormikInputPhoneE name="phone" label="Teléfono" />
							<FormikInputValue name="neighborhood" label="Colonia" />
							<FormikInputValue name="address" label="Dirección" />
							<View style={{ justifyContent: 'center' }}>
								<Button
									disabled={loading}
									fullWidth={false}
									buttonStyles={{ marginHorizontal: 'auto', marginTop: 20 }}
									label="Guardar"
									onPress={() => {
										handleSubmit()
									}}
									icon="save"
								></Button>
							</View>
						</View>
					)
				}}
			</Formik>
		</View>
	)
}

export const FormClientE = (props: FormCLientProps) => (
	<ErrorBoundary componentName="FormClient">
		<FormClient {...props} />
	</ErrorBoundary>
)

export default FormClient
