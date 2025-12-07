import { View, Text, StyleSheet } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import StoreType, { bot_configs } from '../types/StoreType'
import Button from './Button'
const FormChatbot = (props?: FormChatbotProps) => {
	const defaultValues: StoreType['chatbot'] = props.values || {
		enabled: false,
		id: '',
		apiKey: '',
		hostNumber: '',
		enabledAutoWs: false,
		sender: 'bajarent'
	}

	return (
		<View>
			<Formik
				initialValues={defaultValues}
				onSubmit={values => {
					if (props.onSubmit) return props.onSubmit(values)
				}}
			>
				{({ values, handleSubmit, isSubmitting }) => (
					<View
						style={{
							padding: 4,
							backgroundColor: theme.white,
							borderRadius: 8
						}}
					>
						<Text style={gStyles.h3}>Chatbot</Text>
						<FormikCheckbox name="enabled" label="Activar chatbot"></FormikCheckbox>
						{values?.enabled && (
							<>
								<View style={styles.input}>
									<FormikInputValue name="id" label="Bot Id" />
								</View>
								<View style={styles.input}>
									<FormikInputValue name="apiKey" label="Api Key" />
								</View>
								<View style={styles.input}>
									<FormikInputValue name="hostNumber" label="Numero anfitrión" />
								</View>
							</>
						)}
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								marginVertical: 16
							}}
						>
							<Button
								size="xs"
								label="Actualizar"
								onPress={handleSubmit}
								disabled={isSubmitting}
							></Button>
						</View>
					</View>
				)}
			</Formik>
		</View>
	)
}
export default FormChatbot
export type FormChatbotProps = {
	values?: StoreType['chatbot']
	onSubmit?: (values: StoreType['chatbot']) => Promise<any>
}
export const FormChatbotE = (props: FormChatbotProps) => (
	<ErrorBoundary componentName="FormChatbot">
		<FormChatbot {...props} />
	</ErrorBoundary>
)
const styles = StyleSheet.create({
	input: {
		marginVertical: 10
	},
	type: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		margin: 4
	}
})
