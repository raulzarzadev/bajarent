import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import { ServiceCustomers } from '../../firebase/ServiceCustomers'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import useModal from '../../hooks/useModal'
import type { CustomerType } from '../../state/features/costumers/customerType'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'
import { customerFromOrder, findSimilarCustomer, mergeCustomers } from './lib/customerFromOrder'

const ModalCreateCustomers = (props?: ModalCreateCustomersProps) => {
	const modal = useModal()
	return (
		<View>
			<Button onPress={modal.toggleOpen} label="Crear clientes"></Button>
			<StyledModal {...modal} title="Crear clientes">
				<CreateCustomers ordersIds={props.ordersIds} />
			</StyledModal>
		</View>
	)
}

export const CreateCustomers = ({ ordersIds = [] }) => {
	const [disabled, setDisabled] = useState(false)
	const [progress, setProgress] = useState(0)
	const { storeId } = useStore()
	const [storeCustomers, setStoreCustomers] = useState<Partial<CustomerType>[]>([])
	const [customerCreated, setCustomerCreated] = useState([])
	const [omittedCustomer, setCustomersOmitted] = useState([])
	const [mergedCustomers, setMergedCustomers] = useState([])
	useEffect(() => {
		// todas las ordenes y todos los clientes de las ordenes
		ServiceCustomers.getByStore(storeId).then(customers => {
			setStoreCustomers(customers)
		})
	}, [ordersIds])

	const handleCreateCustomers = async () => {
		const dbCustomers = [...storeCustomers]
		const newCustomersCreated: Partial<CustomerType>[] = []
		const omittedCustomer = []
		const mergedCustomers = []
		let index = 1
		for (const orderId of ordersIds) {
			setProgress(index++)
			setDisabled(true)
			const dbOrder = await ServiceOrders.get(orderId)
			const dbCustomerOrder = customerFromOrder(dbOrder)
			// check if similar customer already exist dont addit
			const similarCustomerFound = findSimilarCustomer(dbCustomerOrder, [
				...newCustomersCreated,
				...dbCustomers
			])
			// if customer is excluded dont update/create customer and order
			if (dbOrder?.excludeCustomer) {
				//* CUSTOMER OMITTED
				omittedCustomer.push(dbCustomerOrder)
				setCustomersOmitted(omittedCustomer)
				continue
			} // Salta a la siguiente iteración

			if (similarCustomerFound) {
				//merge customer
				const mergedCustomer = mergeCustomers(similarCustomerFound, dbCustomerOrder)
				//update customer
				ServiceCustomers.update(mergedCustomer?.id, mergedCustomer)
					.then(res => {
						console.log(res)
					})
					.catch(e => console.log({ e, mergedCustomer }))
				//update order
				ServiceOrders.update(orderId, {
					customerId: mergedCustomer?.id,
					customerName: mergedCustomer?.name
				})
					.then(res => {
						console.log(res)
					})
					.catch(e => console.log({ e }))

				//* CUSTOMER UPDATED
				mergedCustomers.push(mergedCustomer)
			} else {
				// get customer
				const res = await ServiceCustomers.create(dbCustomerOrder)
					.then(res => {
						res.res.id
						console.log(res)
						return res
					})
					.catch(e => console.log({ e }))
				// update order
				//@ts-expect-error
				const newCustomerId = res?.res?.id
				ServiceOrders.update(orderId, {
					customerId: newCustomerId,
					customerName: dbCustomerOrder.name
				})
				//* CUSTOMER CREATED
				newCustomersCreated.push({ ...dbCustomerOrder, id: newCustomerId })
			}
			setMergedCustomers(mergedCustomers)
			setCustomerCreated(newCustomersCreated)
			setCustomersOmitted(omittedCustomer)
		}
		setDisabled(false)
	}
	return (
		<View>
			<Text style={{ marginVertical: 6 }}>
				Progreso {progress} de {ordersIds.length}
			</Text>
			<Text style={{ marginVertical: 6 }}>Clientes creados {customerCreated.length}</Text>
			<Text style={{ marginVertical: 6 }}>Clientes actualizados {mergedCustomers.length}</Text>
			<Text style={{ marginVertical: 6 }}>Clientes omitidos {omittedCustomer.length}</Text>
			<Button
				label="Crear clientes"
				disabled={disabled}
				onPress={() => {
					handleCreateCustomers()
				}}
			/>
		</View>
	)
}
export default ModalCreateCustomers
export type ModalCreateCustomersProps = {
	ordersIds?: string[]
}
export const ModalCreateCustomersE = (props: ModalCreateCustomersProps) => (
	<ErrorBoundary componentName="ModalCreateCustomers">
		<ModalCreateCustomers {...props} />
	</ErrorBoundary>
)
