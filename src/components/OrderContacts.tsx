import { Text, View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { onMarkContactAsFavorite, onRemoveContact } from '../libs/order-actions'
import type { ContactType } from '../types/OrderType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import CardPhone from './CardPhone'

/**
 * @deprecated now  contacnts is from customers
 * @returns
 */
const OrderContacts = () => {
	return null
}

export const ContactsList = () => {
	const { order } = useOrderDetails()
	const handleMarkAsFavorite = (contactId: ContactType['id']) => {
		onMarkContactAsFavorite({
			contact: contacts?.find(({ id }) => contactId === id),
			orderId: order.id,
			isFavorite: !contacts?.find(({ id }) => contactId === id)?.isFavorite
		})
	}
	const handleDeleteContact = (contactId: ContactType['id']) => {
		onRemoveContact({
			contact: contacts?.find(({ id }) => contactId === id),
			orderId: order.id
		})
	}

	const sortById = (a: ContactType, b: ContactType) => {
		return a?.id?.localeCompare(b?.id)
	}

	const contacts = order?.contacts as ContactType[]
	return (
		<View>
			<ContactRow contact={{ phone: order?.phone, name: '' }} />
			{contacts?.sort(sortById).map(contact => (
				<ContactRow
					contact={contact}
					key={contact.name}
					handleDeleteContact={handleDeleteContact}
					handleMarkAsFavorite={handleMarkAsFavorite}
				/>
			))}
		</View>
	)
}

export const ContactRow = ({
	contact,
	handleMarkAsFavorite,
	handleDeleteContact
}: {
	contact: ContactType
	handleMarkAsFavorite?: (contactId: ContactType['id']) => void
	handleDeleteContact?: (contactId: ContactType['id']) => void
}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{handleMarkAsFavorite && (
				<Button
					justIcon
					icon={contact.isFavorite ? 'starFilled' : 'starEmpty'}
					color={contact.isFavorite ? 'success' : 'info'}
					variant="ghost"
					onPress={() => {
						handleMarkAsFavorite(contact?.id)
					}}
				/>
			)}
			<Text>{contact.name} </Text>
			<CardPhone phone={contact.phone} />
			{handleDeleteContact && (
				<ButtonConfirm
					justIcon
					icon={'delete'}
					modalTitle="Eliminar contacto"
					openColor={'error'}
					openVariant="ghost"
					confirmLabel="Eliminar"
					text="¿Estás seguro de eliminar este contacto?"
					confirmColor="error"
					confirmVariant="outline"
					handleConfirm={async () => {
						return await handleDeleteContact(contact?.id)
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Text>{contact.name} </Text>
						<CardPhone phone={contact.phone} />
					</View>
				</ButtonConfirm>
			)}
		</View>
	)
}

export default OrderContacts
