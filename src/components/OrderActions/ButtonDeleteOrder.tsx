import { useEmployee } from '../../contexts/employeeContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import ButtonConfirm from '../ButtonConfirm'

const ButtonDeleteOrder = ({ orderId, orderIds }: { orderId?: string; orderIds?: string[] }) => {
	const {
		permissions: { canDeleteOrders }
	} = useEmployee()

	const handleDeleteOrder = async () => {
		if (orderId) {
			return await ServiceOrders.delete(orderId)
				.then(() => {
					console.log('delete')
				})
				.catch(console.error)
		}
		if (orderIds?.length > 0) {
			const deletePromises = orderIds.map(async id => {
				return await ServiceOrders.delete(id)
			})

			const res = await Promise.all(deletePromises)
			return res
		}
	}

	return (
		<ButtonConfirm
			icon="delete"
			openDisabled={!canDeleteOrders}
			openSize="small"
			openColor="error"
			openLabel="Eliminar"
			openVariant="ghost"
			confirmColor="error"
			confirmLabel="Eliminar"
			text="Esta orden se eliminara de forma permanente"
			handleConfirm={async () => {
				return await handleDeleteOrder()
			}}
		></ButtonConfirm>
	)
}

export default ButtonDeleteOrder
