import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Linking, Text, View } from 'react-native'
import useModal from '../../hooks/useModal'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import type { CustomerType } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import Button from '../Button'
import CardPhone from '../CardPhone'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'
import { FormikCustomerContacts } from './FormCustomer'

const CustomerContacts = (props?: CustomerContactsProps) => {
	const cantAdd = props?.canAdd
	const customerContacts = props?.customerContacts
	const customerId = props?.customerId
	const { update: updateCustomer } = useCustomers()

	const [disabled, setDisabled] = useState(false)

	const handleMarkAsFavorite = async (
		contactId: string,
		isFavorite: boolean,
		{ customerContacts }
	) => {
		const restContactsAsNotFavorite = Object.keys(customerContacts).reduce((acc, curr) => {
			return {
				...acc,
				[`contacts.${curr}.isFavorite`]: contactId === curr ? !isFavorite : false
			}
		}, {})

		setDisabled(true)
		await updateCustomer(customerId, {
			...restContactsAsNotFavorite
		})
		setDisabled(false)
	}
	const [contacts, setContacts] = useState([])

	useEffect(() => {
		setContacts(Object.values(customerContacts || {}))
	}, [customerContacts])

	if (contacts?.length === 0) {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={[gStyles.helper, gStyles.tCenter]}>No hay contactos</Text>
				{cantAdd && <ModalEditContact contacts={customerContacts} customerId={customerId} />}
			</View>
		)
	}
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={gStyles.h3}>Contactos </Text>
				{cantAdd && <ModalEditContact contacts={customerContacts} customerId={customerId} />}
			</View>
			{contacts.map(
				contact =>
					!!contact &&
					!contact?.deletedAt && (
						<View
							key={contact?.id}
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								maxWidth: 400,
								margin: 'auto'
							}}
						>
							{handleMarkAsFavorite && cantAdd && (
								<Button
									disabled={disabled}
									justIcon
									icon={contact?.isFavorite ? 'starFilled' : 'starEmpty'}
									color={contact?.isFavorite ? 'success' : 'info'}
									variant="ghost"
									onPress={() => {
										handleMarkAsFavorite(contact.id, contact?.isFavorite, {
											customerContacts
										})
									}}
								/>
							)}
							<Text style={{ width: 120, alignSelf: 'center' }} numberOfLines={1}>
								{contact?.label}
							</Text>
							{/* <Text>{contact?.type}</Text> */}
							{contact.type === 'phone' && <CardPhone phone={contact.value} />}
							{contact.type === 'email' && (
								<View
									style={{
										flexDirection: 'row',
										width: 200
									}}
								>
									<Text style={{ alignSelf: 'center' }}>{contact.value}</Text>
									<Button
										variant="ghost"
										justIcon
										icon="email"
										onPress={() => {
											Linking.openURL(`mailto:${contact.value}`)
										}}
									/>
								</View>
							)}
						</View>
					)
			)}
		</View>
	)
}
export const ModalEditContact = ({ contacts, customerId }) => {
	const { update } = useCustomers()

	const modal = useModal({ title: 'Agregar contacto' })
	return (
		<>
			<Button onPress={modal.toggleOpen} justIcon icon="add" variant="ghost" size="small" />
			<StyledModal {...modal}>
				<Formik
					initialValues={{ contacts }}
					onSubmit={async values => {
						return await update(customerId, {
							contacts: values?.contacts
						})
					}}
				>
					{({ handleSubmit, isSubmitting }) => (
						<>
							<FormikCustomerContacts />
							<Button onPress={handleSubmit} disabled={isSubmitting}>
								Guardar
							</Button>
						</>
					)}
				</Formik>
			</StyledModal>
		</>
	)
}
export default CustomerContacts
export type CustomerContactsProps = {
	customerId: string
	customerContacts?: CustomerType['contacts']
	canAdd?: boolean
}
export const CustomerContactsE = (props: CustomerContactsProps) => (
	<ErrorBoundary componentName="CustomerContacts">
		<CustomerContacts {...props} />
	</ErrorBoundary>
)
