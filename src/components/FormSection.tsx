import { Formik } from 'formik'

import { StyleSheet, View } from 'react-native'
import { store_section_icons, store_section_types } from '../types/SectionType'
import Button from './Button'
import FormikInputRadios from './FormikInputRadios'
import FormikInputValue from './FormikInputValue'

const FormSection = ({
	defaultValues = {},
	onSubmit = async values => {
		console.log(values)
	}
}) => {
	const [sending, setSending] = React.useState(false)
	return (
		<Formik
			initialValues={{ name: '', ...defaultValues }}
			onSubmit={async values => {
				setSending(true)
				await onSubmit(values).then(console.log).catch(console.error)
				setTimeout(() => {
					setSending(false)
				}, 1000)
			}}
		>
			{({ handleSubmit }) => (
				<View style={styles.form}>
					<View style={styles.input}>
						<FormikInputValue name={'name'} placeholder="Nombre" />
					</View>
					<View style={styles.input}>
						<FormikInputValue name={'description'} placeholder="Descripción" />
					</View>
					<View style={styles.input}>
						<FormikInputRadios
							options={Object.entries(store_section_types).map(([value, label]) => {
								return { value, label, iconLabel: store_section_icons[value] }
							})}
							name="type"
						/>
					</View>

					<View style={styles.input}>
						<Button onPress={handleSubmit} label={'Guardar'} disabled={sending} />
					</View>
				</View>
			)}
		</Formik>
	)
}

export default FormSection
const styles = StyleSheet.create({
	form: {
		padding: 0
	},
	input: {
		marginVertical: 10
	},
	permissions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	permission: {
		margin: 2,
		marginVertical: 8
	}
})
