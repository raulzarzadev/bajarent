import { where } from 'firebase/firestore'
import { json2csv } from 'json-2-csv'

import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import { ServiceCustomers } from '../firebase/ServiceCustomers'
import { ServiceOrders } from '../firebase/ServiceOrders'
import useModal from '../hooks/useModal'
import { currentRentPeriod } from '../libs/orders'
import asDate, { dateFormat } from '../libs/utils-date'
import type { CustomerType } from '../state/features/costumers/customerType'
import type OrderType from '../types/OrderType'
import { type ContactType, order_type } from '../types/OrderType'
import Button from './Button'
import { getUserName } from './SpanUser'
import StyledModal from './StyledModal'

const ButtonDownloadCSV = () => {
	const { storeId, staff } = useStore()
	const modal = useModal({ title: 'Descargar CSV' })

	const handleDownloadRents = () => {
		return ServiceOrders.findMany([
			where('storeId', '==', storeId),
			where('type', '==', 'RENT'),
			where('status', '==', 'DELIVERED')
		]).then(rents => {
			const res = json2csv(formatRentsToCSV(rents, staff))
			downloadLink({
				res,
				fileName: `rentas-activas-${dateFormat(new Date(), 'ddMMMyy')}`
			})
		})
	}
	const handleDownloadCustomers = () => {
		ServiceCustomers.getByStore(storeId).then(customers => {
			const res = json2csv(formatCustomers(customers))
			downloadLink({
				res,
				fileName: `clientes-${dateFormat(new Date(), 'ddMMMyy')}`
			})
		})
	}
	const handleDownloadAllRents = () => {
		ServiceOrders.findMany([where('storeId', '==', storeId), where('type', '==', 'RENT')]).then(
			rents => {
				const res = json2csv(formatRentsToCSV(rents, staff))
				downloadLink({
					res,
					fileName: `todas-las-rentas-${dateFormat(new Date(), 'ddMMMyy')}`
				})
			}
		)
	}
	const handleDownloadRepairs = () => {
		ServiceOrders.findMany([
			where('storeId', '==', storeId),
			where('type', '==', order_type.REPAIR)
		]).then(rents => {
			const res = json2csv(formatRentsToCSV(rents, staff))
			downloadLink({
				res,
				fileName: `reparaciones-${dateFormat(new Date(), 'ddMMMyy')}`
			})
		})
	}
	return (
		<View>
			<Button
				label="Descargar"
				icon="download"
				onPress={() => {
					modal.toggleOpen()
				}}
			/>
			<StyledModal {...modal}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap'
					}}
				>
					<Button
						buttonStyles={{ margin: 10 }}
						label="Rentas activas ⏰"
						onPress={() => {
							handleDownloadRents()
						}}
					></Button>

					<Button
						buttonStyles={{ margin: 10 }}
						label="Todas las rentas ⏰"
						onPress={() => {
							handleDownloadAllRents()
						}}
					></Button>
					<Button
						buttonStyles={{ margin: 10 }}
						label="Reparaciónes ⏰"
						onPress={() => {
							handleDownloadRepairs()
						}}
					></Button>
					<Button
						buttonStyles={{ margin: 10 }}
						label="Descargar clientes"
						onPress={() => {
							handleDownloadCustomers()
						}}
					/>
				</View>
			</StyledModal>
		</View>
	)
}
const downloadLink = ({ res, fileName = 'download' }) => {
	// Convertir la cadena CSV en un Blob
	const csvBlob = new Blob([res], { type: 'text/csv;charset=utf-8;' })

	// Crear un URL para el Blob
	const csvUrl = URL.createObjectURL(csvBlob)

	// Crear un elemento <a> temporal para simular un clic de descarga
	const downloadLink = document.createElement('a')
	downloadLink.href = csvUrl
	downloadLink.setAttribute('download', `${fileName}.csv`) // Nombre del archivo a descargar
	document.body.appendChild(downloadLink) // Necesario para que funcione en Firefox
	downloadLink.click()
	document.body.removeChild(downloadLink) // Limpiar el DOM
	// aqui deberia mostrar un prompt en la pantalla para descargar el archivo
}

const formatDate = date => (date ? dateFormat(asDate(date), 'yyyy-MM-dd HH:mm:ss') : '')

const formatRentsToCSV = (rents, staff) => {
	const formatUser = userId => getUserName(staff, userId) || ''
	return rents.map((rent: Partial<OrderType>) => {
		const contacts = (rent?.contacts as ContactType[]) || []
		return {
			type: dictionary(rent?.type) || '',
			status: dictionary(rent?.status) || '',
			folio: rent?.folio || '',
			note: rent?.note || '',
			customerId: rent?.customerId || '',
			items:
				rent?.items?.map(item => `${item?.number || ''} ${item?.serial || ''}`).join(', ') ||
				'' ||
				'',
			fullName: rent?.fullName || '',
			//email: rent?.email || '',
			phone:
				`${rent?.phone} ${contacts?.length > 0 ? ', ' : ''}${contacts
					?.map(c => `${c?.phone || ''}`)
					.join(', ')}` || '',
			address: rent?.address || '',
			neighborhood: rent?.neighborhood || '',
			coords: rent?.coords || '',
			time: currentRentPeriod(rent) || '',

			deliveredAt: formatDate(rent.deliveredAt) || '',
			expireAt: formatDate(rent.expireAt) || '',
			// pickedUpAt: formatDate(rent.pickedUpAt) || '',
			// pickedUpBy: formatUser(rent.pickedUpBy) || '',
			deliveredBy: formatUser(rent.deliveredBy) || '',
			createdBy: formatUser(rent.createdBy) || '',
			createdAt: formatDate(rent.createdAt) || ''
		}
	})
}
const formatCustomers = (customers: Partial<CustomerType>[]) => {
	return customers.map((customer: Partial<CustomerType>) => {
		const customerContactsString = Object.values(customer.contacts || {})
			.map(contact => {
				return `${contact.id || ''}-${contact.type || ''}: ${contact.value || ''}`
			})
			.join(', ')
		const customerImagesString = Object.values(customer?.images || {})
			.map(image => {
				return `${image.id || ''}-${image.type || ''}: ${image.src || ''} `
			})
			.join(', ')
		return {
			id: customer.id,
			name: customer.name,
			contacts: customerContactsString,
			images: customerImagesString,
			street: customer.address.street,
			neighborhood: customer.address.neighborhood,
			references: customer.address.references,
			coords: customer.address.coords || customer.address.locationURL || null,
			createdAt: formatDate(customer.createdAt) || ''
		}
	})
}

export default ButtonDownloadCSV
