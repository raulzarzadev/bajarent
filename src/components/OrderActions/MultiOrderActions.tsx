import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import { useStore } from '../../contexts/storeContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import useModal from '../../hooks/useModal'
import useMyNav from '../../hooks/useMyNav'
import { onAssignOrder, onCancel } from '../../libs/order-actions'
import { excelFormatToOrder, orderAsExcelFormat } from '../../libs/orders'
import asDate, { dateFormat } from '../../libs/utils-date'
import { gStyles } from '../../styles'
import type OrderType from '../../types/OrderType'
import { order_status, order_type } from '../../types/OrderType'
import Button from '../Button'
import ButtonConfirm from '../ButtonConfirm'
import { ModalCreateCustomersE } from '../Customers/ModalCreateCustomers'
import InputAssignSection from '../InputAssingSection'
import SpanCopy from '../SpanCopy'
import StyledModal from '../StyledModal'
import ButtonDeleteOrder from './ButtonDeleteOrder'
import ModalEditMultiOrders from './ModalEditMultiOrders'

const MultiOrderActions = ({ ordersIds = [], data }: { ordersIds: string[]; data: unknown[] }) => {
	const { toOrders } = useMyNav()
	const { storeId, user } = useAuth()
	const {
		permissions: { orders: permissionsOrder, isOwner, isAdmin }
	} = useEmployee()

	const canCancel = permissionsOrder?.canCancel || isOwner || isAdmin
	const canDelete = permissionsOrder?.canDelete || isOwner || isAdmin

	const handleCancelOrders = async () => {
		const res = ordersIds.map(id =>
			onCancel({
				orderId: id,
				userId: user.id,
				cancelledReason: 'Cancelado en lote',
				storeId
			})
		)
		return await Promise.all(res)
	}

	const rentOrdersDelivered = data.filter(
		o =>
			o['status'] === order_status.DELIVERED &&
			o['type'] === order_type.RENT &&
			ordersIds.includes(o['id'])
	)

	const buttons = [
		<ModalCreateCustomersE ordersIds={ordersIds} />,
		<Button
			label="Lista de ordenes"
			onPress={() => {
				toOrders({
					ids: ordersIds
				})
			}}
		/>,
		<ModalExcelRows ordersIds={ordersIds} />,
		<ModalAssignOrders ordersIds={ordersIds} />,
		<ModalEditMultiOrders ordersIds={ordersIds} />,

		canCancel && (
			<ButtonConfirm
				confirmLabel="Cancelar"
				openLabel="Cancelar"
				icon="cancel"
				openVariant="outline"
				confirmVariant="outline"
				openColor="neutral"
				confirmColor="error"
				handleConfirm={handleCancelOrders}
			>
				{rentOrdersDelivered.length > 0 ? (
					<Text style={[gStyles.h2, gStyles.tError, { marginVertical: 8 }]}>
						{` Algunas ordenes de renta estan VIGENTES . 
           (${rentOrdersDelivered.length}) 
            Cancelarlas podria afectar los inventarios, ordenes de trabajo y otras estadisitcas `}
					</Text>
				) : null}
			</ButtonConfirm>
		),
		canDelete && <ButtonDeleteOrder orderIds={ordersIds} />
	]
	return (
		<View style={{ marginTop: 8 }}>
			<Text style={gStyles.h3}>
				{ordersIds?.length || 0} de {data?.length}
			</Text>
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'space-around',
					padding: 2,
					flexWrap: 'wrap'
				}}
			>
				{buttons.map(
					(button, i) =>
						button && (
							<View key={i} style={{ padding: 4, width: '50%' }}>
								{button}
							</View>
						)
				)}
				{/* To fix las element */}
				<View style={{ flex: 1 }} />
			</View>
		</View>
	)
}

const ModalAssignOrders = ({ ordersIds }: { ordersIds: string[] }) => {
	const { storeId } = useStore()

	const handleAssignOrders = async ({ sectionId, sectionName, ordersIds }) => {
		try {
			const promises = ordersIds.map(orderId =>
				onAssignOrder({ orderId, sectionId, sectionName, storeId })
			)

			const res = await Promise.all(promises)
			//TODO:  reasign multiple orders
			//  addWork({
			//   work: {
			//     type: 'order',
			//     action: 'order_reassigned',
			//     details: {
			//       sectionId,
			//       orderId
			//     }
			//   }
			// })
			return res
		} catch (e) {
			console.error({ e })
		}
	}
	return (
		<View>
			<InputAssignSection
				currentSection={null}
				setNewSection={async ({ sectionId, sectionName }) => {
					await handleAssignOrders({ sectionId, sectionName, ordersIds })
				}}
			/>
		</View>
	)
}

const ModalExcelRows = ({ ordersIds }: { ordersIds: OrderType['id'][] }) => {
	const modal = useModal({ title: 'Formato excel' })
	const [orders, setOrders] = React.useState<OrderType[]>([])

	useEffect(() => {
		ServiceOrders.getList(ordersIds).then(res => {
			setOrders(res)
		})
	}, [ordersIds])

	return (
		<View>
			<Button
				onPress={modal.toggleOpen}
				label="Formato excel"
				icon="list"
				variant="outline"
				color="neutral"
			></Button>
			<StyledModal {...modal}>
				{ordersIds.map(id => {
					const order = orders.find(o => o.id === id)
					const excelRow = orderAsExcelFormat(order)
					const { note, fullName, phone, neighborhood, address, references, scheduledAt } =
						excelFormatToOrder(excelRow)
					return (
						<Text
							key={id}
							style={[{ marginBottom: 6, flexDirection: 'row' }, gStyles.helper]}
							numberOfLines={1}
						>
							<Text style={{ width: 60 }}>{note}</Text>
							<Text style={{ width: 60 }}>{fullName}</Text>
							<Text style={{ width: 60 }}>{phone}</Text>
							<Text style={{ width: 60 }}>{neighborhood}</Text>
							<Text style={{ width: 60 }}>{address}</Text>
							<Text style={{ width: 60 }}>{references}</Text>
							<Text style={{ width: 60 }}>{dateFormat(asDate(scheduledAt), 'dd/MM/yyyy')}</Text>
						</Text>
					)
				})}

				<Text>
					Copia y pega en tu hoja de cálculo favorita. Asegúrate de que los campos estén en el mismo
					orden.
				</Text>
				<SpanCopy
					copyValue={ordersIds
						.map(id => orderAsExcelFormat(orders.find(o => o.id === id)))
						.join('')}
					label={'Copia'}
				/>
			</StyledModal>
		</View>
	)
}

export default MultiOrderActions
