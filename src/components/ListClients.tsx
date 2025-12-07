import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { gStyles } from '../styles'
import { CustomersActionsE } from './Customers/CustomersActions'
import ErrorBoundary from './ErrorBoundary'
import { ListE } from './List'
import ListRow from './ListRow'
export type ListCustomerType = {
	id: string
	name: string
	contact: string
	neighborhood: string
	street: string
	// status: string
}
const ListCustomers = () => {
	const { data: customers } = useCustomers()
	const [formattedCustomers, setFormattedCustomers] = useState<ListCustomerType[]>([])
	useEffect(() => {
		if (customers.length) {
			const formatted = customers.map(customer => {
				const contactsArray = Object.values(customer?.contacts || {})
				const contact =
					contactsArray.find(contact => contact.type === 'phone')?.value || contactsArray[0]?.value
				return {
					id: customer?.id,
					name: customer?.name,
					contact,
					neighborhood: customer?.address?.neighborhood || '',
					street: customer?.address?.street || ''
				}
			})
			setFormattedCustomers(formatted)
		}
	}, [customers])

	const { toCustomers } = useMyNav()

	const { permissions } = useEmployee()
	const canCreateCustomer = permissions.customers.write

	return (
		<View>
			<ListE
				id="list-customers"
				rowsPerPage={20}
				sideButtons={[
					{
						icon: 'add',
						label: 'Nuevo Cliente',
						onPress: () => {
							//@ts-expect-error
							toCustomers({ to: 'new' })
						},
						visible: true,
						disabled: !canCreateCustomer
					}
				]}
				defaultOrder="asc"
				defaultSortBy="name"
				sortFields={[
					{
						key: 'name',
						label: 'Nombre'
					},
					{
						key: 'phone',
						label: 'Teléfono'
					},
					{
						key: 'neighborhood',
						label: 'Colonia'
					},
					{
						key: 'street',
						label: 'Calle'
					}
				]}
				filters={[]}
				data={formattedCustomers}
				ComponentRow={({ item }) => <RowClient customer={item} />}
				onPressRow={id => {
					toCustomers({ to: 'details', id })
				}}
				ComponentMultiActions={({ ids }) => <CustomersActionsE ids={ids} />}
			/>
		</View>
	)
}
const RowClient = ({ customer }: { customer: ListCustomerType }) => {
	return (
		<ListRow
			fields={[
				{
					component: <Text style={gStyles.helper}>{customer?.name}</Text>,
					width: 'rest'
				},
				{
					component: <Text style={gStyles.helper}>{customer?.contact}</Text>,
					width: 'rest'
				},
				{
					component: <Text style={gStyles.helper}>{customer?.neighborhood}</Text>,
					width: 'rest'
				},
				{
					component: <Text style={gStyles.helper}>{customer?.street}</Text>,
					width: 'rest'
				}
			]}
		/>
	)
}

export default ListCustomers

export type ListCustomersProps = {}
export const ListCustomersE = (props: ListCustomersProps) => (
	<ErrorBoundary componentName="ListCustomers">
		<ListCustomers {...props} />
	</ErrorBoundary>
)
