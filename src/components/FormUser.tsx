import { Formik } from 'formik'

import { StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import FormikInputValue from './FormikInputValue'

const FormUser = ({
	defaultValues,
	onSubmit = async values => {
		console.log(values)
	}
}) => {
	const [loading, setLoading] = React.useState(false)

	return (
		<Formik
			initialValues={{ name: '', ...defaultValues }}
			onSubmit={async values => {
				try {
					setLoading(true)
					await onSubmit(values).then(console.log).catch(console.error)
				} catch (error) {
				} finally {
					setTimeout(() => {
						setLoading(false)
					}, 2000)
				}
			}}
		>
			{({ handleSubmit }) => (
				<View style={styles.form}>
					<View style={styles.input}>
						<FormikInputValue name={'name'} placeholder="Nombre" />
					</View>
					<View style={styles.input}>
						<FormikInputValue name={'phone'} placeholder="Teléfono" disabled />
					</View>
					<View style={styles.input}>
						<FormikInputValue name={'email'} placeholder="Correo" />
					</View>
					<View style={styles.input}>
						<Button disabled={loading} onPress={handleSubmit} label={'Guardar'} />
					</View>
				</View>
			)}
		</Formik>
	)
}

export default FormUser

const styles = StyleSheet.create({
	form: {
		padding: 10
	},
	input: {
		marginVertical: 10
	}
})
