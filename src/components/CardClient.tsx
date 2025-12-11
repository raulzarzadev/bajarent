import { Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import useMyNav from '../hooks/useMyNav'
import { gStyles } from '../styles'
import type { ClientType } from '../types/ClientType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import ErrorBoundary from './ErrorBoundary'
import ImagePreview from './ImagePreview'
import SpanMetadata from './SpanMetadata'

export type CardClientProps = {
	client: Partial<ClientType>
}
export const CardClient = ({ client }: CardClientProps) => {
	return (
		<View style={{ justifyContent: 'center', marginVertical: 6 }}>
			<SpanMetadata
				createdAt={client?.createdAt}
				createdBy={client?.createdBy}
				id={client?.id}
				layout="row"
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					marginVertical: 8
				}}
			>
				<ButtonDeleteClient clientId={client?.id} />
				<Text style={[gStyles.h3, { marginHorizontal: 8 }]}>{client?.name}</Text>
				<ButtonEditClient clientId={client?.id} />
			</View>
			<Text style={[gStyles.tCenter]}>{client?.phone}</Text>
			<Text style={[gStyles.tCenter]}>{client?.address || ''}</Text>
			<Text style={[gStyles.tCenter]}>{client?.neighborhood || ''}</Text>

			<View style={{ justifyContent: 'center', flexDirection: 'row' }}>
				{client?.imageID && <ImagePreview image={client?.imageID} />}
				{client?.imageHouse && <ImagePreview image={client?.imageHouse} />}
			</View>
		</View>
	)
}

const ButtonDeleteClient = ({ clientId }) => {
	const { storeId } = useStore()
	return (
		<ButtonConfirm
			icon="delete"
			openColor="error"
			openVariant="ghost"
			openLabel="Eliminar"
			openSize="xs"
			justIcon
			confirmLabel="Eliminar"
			confirmColor="error"
			confirmVariant="outline"
			modalTitle="Eliminar cliente"
			handleConfirm={async () => {
				ServiceStoreClients.delete({ itemId: clientId, storeId })
			}}
		></ButtonConfirm>
	)
}

const ButtonEditClient = ({ clientId }) => {
	const { toCustomers } = useMyNav()

	return (
		<Button
			size="xs"
			icon="edit"
			label="Editar"
			justIcon
			variant="ghost"
			onPress={() => {
				toCustomers({
					to: 'edit',
					id: clientId
				})
			}}
		></Button>
	)
}

export const CardClientE = (props: CardClientProps) => (
	<ErrorBoundary componentName="CardClient">
		<CardClient {...props} />
	</ErrorBoundary>
)

export default CardClient
