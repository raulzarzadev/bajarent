import { Formik } from 'formik'

import { StyleSheet, Text, View } from 'react-native'
import type { ContactType } from '../types/OrderType'
import Button from './Button'
import FormikInputPhone from './FormikInputPhone'
import FormikInputValue from './FormikInputValue'

const FormContacts = ({
	contact,
	onSubmit
}: {
	contact?: ContactType
	onSubmit: (newContact: ContactType) => Promise<void> | void
}) => {
	return (
		<View>
			<Formik onSubmit={onSubmit} initialValues={contact || { name: '', phone: '' }}>
				{({ handleSubmit }) => (
					<View style={{}}>
						<View style={{ marginVertical: 6 }}>
							<FormikInputValue name="name" placeholder="Nombre" />
						</View>
						<View style={{ marginVertical: 6 }}>
							<FormikInputPhone name="phone" />
						</View>
						<Button onPress={handleSubmit} icon="add" size="xs" />
					</View>
				)}
			</Formik>
		</View>
	)
}

export default FormContacts

const styles = StyleSheet.create({})
