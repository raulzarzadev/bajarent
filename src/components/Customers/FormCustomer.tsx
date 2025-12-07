import { Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import catchError from '../../libs/catchError'
import { createUUID } from '../../libs/createId'
import { mergeObjs } from '../../libs/mergeObjs'
import type { CustomerType } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import { FormikInputPhoneE } from '../FormikInputPhone'
import FormikInputSelect from '../FormikInputSelect'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'

const FormCustomer = (props?: FormCustomerProps) => {
	const defaultCustomer: Partial<CustomerType> = {
		name: '',
		...(props.defaultValues || {})
	}
	const [disabled, setDisabled] = useState(false)
	return (
		<View>
			<Formik
				initialValues={defaultCustomer}
				onSubmit={async values => {
					if (props?.onSubmit) {
						setDisabled(true)
						const [err, res] = await catchError(props.onSubmit(values))
						if (err) {
							console.log('Error submitting customer form:', err)
						} else {
							console.log('Customer form submitted successfully:', res)
						}
						setDisabled(false)
					}
				}}
			>
				{({ handleSubmit }) => {
					return (
						<View>
							<View style={styles.input}>
								<FormikInputValue name="name" label="Nombre" />
							</View>
							<Text style={gStyles.h3}>Dirección</Text>
							<View style={styles.input}>
								<FormikInputValue name="address.neighborhood" label="Colonia" />
							</View>
							<View style={styles.input}>
								<FormikInputValue name="address.street" label="Calle" />
							</View>
							<View style={styles.input}>
								<FormikInputValue name="address.references" label="Referencias" />
							</View>
							<View style={styles.input}>
								<InputLocationFormik name="address.locationURL" />
							</View>

							<FormikCustomerContacts />

							<Button onPress={handleSubmit} label="Guardar" disabled={disabled} />
						</View>
					)
				}}
			</Formik>
		</View>
	)
}
export const FormikCustomerContacts = () => {
	const { values, setValues } = useFormikContext<Partial<CustomerType>>()

	const isMobile = Dimensions.get('window').width <= 768

	const layoutStyle = isMobile ? { marginBottom: 4 } : { marginRight: 2, maxWidth: 100 }
	const handleMarkAsFavorite = (contactId: string, isFavorite: boolean, contacts: any) => {
		const restContactsAsNotFavorite = Object.keys(contacts).reduce(
			(acc, curr) => {
				acc[`contacts.${curr}.isFavorite`] = contactId === curr ? !isFavorite : false
				return acc
			},
			{} as Record<string, boolean>
		)

		const res = mergeObjs(values, restContactsAsNotFavorite)
		setValues(res)
	}
	return (
		<View>
			<Text style={gStyles.h3}>Contactos</Text>
			{Object.entries(values.contacts || {}).map(
				([key]) =>
					!values.contacts[key].deletedAt && (
						<View
							key={key}
							style={[
								styles.input,
								{ marginBottom: 8, flexDirection: isMobile ? 'column' : 'row' }
							]}
						>
							<View style={{ flexDirection: 'row' }}>
								<Button
									justIcon
									icon="delete"
									variant="ghost"
									size="small"
									color="error"
									onPress={() => {
										setValues({
											...values,
											contacts: {
												...values.contacts,
												[key]: {
													...values.contacts[key],
													deletedAt: new Date()
												}
											}
										})
									}}
								/>

								<FormikInputValue
									name={`contacts.${key}.label`}
									placeholder="Nombre"
									style={{ ...layoutStyle }}
									containerStyle={{ flex: 1 }}
								/>
							</View>
							<FormikInputSelect
								name={`contacts.${key}.type`}
								placeholder="Tipo"
								containerStyle={{ ...layoutStyle }}
								options={[
									{
										label: 'Teléfono',
										value: 'phone'
									},
									{
										label: 'Correo',
										value: 'email'
									}
								]}
							/>
							{values.contacts[key]?.type === 'phone' && (
								<FormikInputPhoneE name={`contacts.${key}.value`} />
							)}
							{values.contacts[key]?.type === 'email' && (
								<FormikInputValue
									containerStyle={{ flex: 1 }}
									placeholder="Correo"
									name={`contacts.${key}.value`}
								/>
							)}
							<Button
								justIcon
								icon={values.contacts[key]?.isFavorite ? 'starFilled' : 'starEmpty'}
								color={values.contacts[key].isFavorite ? 'success' : 'info'}
								variant="ghost"
								onPress={() => {
									handleMarkAsFavorite(
										values?.contacts[key].id,
										values?.contacts[key]?.isFavorite,
										values?.contacts
									)
								}}
							/>
						</View>
					)
			)}

			<Button
				onPress={() => {
					const contactId = createUUID({ length: 8 })
					setValues({
						...values,
						contacts: {
							...values.contacts,
							[contactId]: {
								label: '',
								type: '',
								value: '',
								id: `${contactId}`
							}
						}
					})
				}}
				icon="add"
				variant="ghost"
				label="Agregar contacto"
				size="xs"
				buttonStyles={{ marginBottom: 8 }}
			></Button>
		</View>
	)
}

export default FormCustomer
export type FormCustomerProps = {
	onSubmit?: (values: Partial<CustomerType>) => Promise<void>
	defaultValues?: Partial<CustomerType>
}
export const FormCustomerE = (props: FormCustomerProps) => (
	<ErrorBoundary componentName="FormCustomer">
		<FormCustomer {...props} />
	</ErrorBoundary>
)

const styles = StyleSheet.create({
	input: {
		marginVertical: 8
	}
})
