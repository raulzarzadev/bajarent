import { CustomerType } from '../state/features/costumers/customerType'
import ErrorBoundary from './ErrorBoundary'
import InputSearch from './Inputs/InputSearch'
import { useField, useFormikContext } from 'formik'

/**
 * Formik wrapper for the InputSearch Client component
 * @param param0 FormikSearchCustomerProps
 * @returns
 */

//TODO: is a input search for clients
const FormikSearchCustomer = ({
	name,
	placeholder,
	customers = [],
	maxSuggestions,
	style
}: FormikSearchCustomerProps) => {
	const { setValues, values } = useFormikContext()
	const [field, meta, helpers] = useField(name)
	const suggestions = customers.map(formatCustomerForSearch)
	return (
		<InputSearch
			value={field.value}
			placeholder={placeholder}
			suggestions={suggestions}
			labelKey={'contactsText'}
			maxSuggestions={maxSuggestions}
			style={style}
			onChange={text => {
				helpers.setValue(text)
			}}
			onSelect={selectedItem => {
				setValues(
					{
						...(values as Object),
						customerId: selectedItem.id,
						fullName: selectedItem.name
					},
					true
				)
			}}
		/>
	)
}

export default FormikSearchCustomer

export const formatCustomerForSearch = (customer: CustomerType) => {
	// Formatear contactos para mostrar como {contacto1: valor, contacto2: valor}
	let formattedContacts = {}
	let contactsText = ''

	if (customer.contacts && typeof customer.contacts === 'object') {
		// Si contacts es un objeto con propiedades
		const contactEntries = Object.entries(customer.contacts)
		formattedContacts = contactEntries.reduce(
			(acc, [key, contact], index) => {
				const contactKey =
					contact.label === 'Default'
						? `contacto${index + 1}`
						: contact.label.toLowerCase().replace(/\s+/g, '')
				acc[contactKey] = contact.value
				return acc
			},
			{} as Record<string, string>
		)

		// Crear una representación de texto de los contactos para búsqueda
		contactsText = Object.entries(formattedContacts)
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ')
	}

	return {
		...customer,
		// Crear una representación de texto de los contactos para búsqueda
		contactsText: `${customer.name} - ${contactsText}`,
		// Mantener los contactos formateados para uso posterior
		...formattedContacts
	}
}

type FormikSearchCustomerProps = {
	name: string
	placeholder?: string
	customers?: CustomerType[]
	maxSuggestions?: number
	style?: any
}
export const FormikSearchCustomerE = (props: FormikSearchCustomerProps) => (
	<ErrorBoundary componentName="FormikSearchCustomer">
		<FormikSearchCustomer {...props} />
	</ErrorBoundary>
)
