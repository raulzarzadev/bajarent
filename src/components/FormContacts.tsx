import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { ContactType } from '../types/OrderType'
import FormikInputValue from './FormikInputValue'
import FormikInputPhone from './FormikInputPhone'
import Button from './Button'

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
