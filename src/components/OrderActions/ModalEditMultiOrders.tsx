import { useState } from 'react'
import { Text, View } from 'react-native'
import { useEmployee } from '../../contexts/employeeContext'
import dictionary from '../../dictionary'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import useModal from '../../hooks/useModal'
import { gStyles } from '../../styles'
import { order_status, TypeOrder } from '../../types/OrderType'
import Button from '../Button'
import ButtonConfirm from '../ButtonConfirm'
import InputSelect from '../InputSelect'
import StyledModal from '../StyledModal'
import TextInfo from '../TextInfo'

const ModalEditMultiOrders = ({ ordersIds = [] }) => {
	const modal = useModal({ title: 'Editar ordenes' })
	const {
		permissions: { isAdmin }
	} = useEmployee()
	const [form, setForm] = useState<Record<string, string>>({})
	return (
		<View>
			<Button
				onPress={modal.toggleOpen}
				label="Editar"
				icon="edit"
				variant="outline"
				color="neutral"
				// disabled={!isAdmin}
			></Button>
			<StyledModal {...modal}>
				<TextInfo
					type="warning"
					defaultVisible
					text={` Editar de forma indiscriminada, estas órdenes, puede generar conflictos en la información. Por favor, verifique que las opciones seleccionadas sean las correctas.`}
				/>
				<View>
					<InputSelect
						helperText="Tipo de orden"
						placeholder="Tipo de orden"
						onChangeValue={value => {
							if (!value) {
								delete form.type
								setForm({ ...form })
							} else {
								setForm({ ...form, type: value })
							}
						}}
						options={[
							{
								label: dictionary(TypeOrder.RENT),
								value: TypeOrder.RENT
							},
							{
								label: dictionary(TypeOrder.SALE),
								value: TypeOrder.SALE
							},
							{
								label: dictionary(TypeOrder.REPAIR),
								value: TypeOrder.REPAIR
							}
						]}
					/>
					<InputSelect
						helperText="Status de la orden"
						placeholder="Status de la orden"
						onChangeValue={value => {
							if (!value) {
								delete form.type
								setForm({ ...form })
							} else {
								setForm({ ...form, status: value })
							}
						}}
						options={[
							{
								label: dictionary(order_status.PENDING),
								value: order_status.PENDING
							},
							{
								label: dictionary(order_status.AUTHORIZED),
								value: order_status.AUTHORIZED
							},
							{
								label: dictionary(order_status.DELIVERED),
								value: order_status.DELIVERED
							},
							{
								label: dictionary(order_status.PICKED_UP),
								value: order_status.PICKED_UP
							},
							{
								label: dictionary(order_status.REPAIRED),
								value: order_status.REPAIRED
							},
							{
								label: dictionary(order_status.REPAIRING),
								value: order_status.REPAIRING
							},
							{
								label: dictionary(order_status.CANCELLED),
								value: order_status.CANCELLED
							}
						]}
					/>

					{Object.entries(form).length > 0 && (
						<TextInfo
							type="warning"
							defaultVisible
							text={`Se editaran las siguientes opciones en las ordenes seleccionadas`}
						/>
					)}
					{Object.entries(form).length > 0 && (
						<Text style={gStyles.h1}>Ordenes seleccionadas: {ordersIds.length}</Text>
					)}
					{Object.entries(form).map(([key, value]) => (
						<Text key={key} style={gStyles.h3}>
							{dictionary(key)}: {dictionary(value)}
						</Text>
					))}
					{!isAdmin && <Text style={gStyles.h3}>** Requiere permisos de administrador **</Text>}
					<ButtonConfirm
						openLabel="Editar"
						confirmLabel="Confirmar"
						handleConfirm={async () => {
							const promises = ordersIds.map(id => {
								return ServiceOrders.update(id, form)
							})
							try {
								const res = await Promise.all(promises)
								console.log({ res })
								res
								return
							} catch (error) {
								console.log(error)
							}
						}}
						confirmColor="error"
						confirmVariant="outline"
						icon="edit"
						openDisabled={!isAdmin}
					>
						<Text style={gStyles.h2}>Editar {ordersIds.length} ordenes seleccionadas</Text>
						<Text style={gStyles.h2}>Con los siguientes datos</Text>
						{Object.entries(form).map(([key, value]) => (
							<Text key={key} style={gStyles.h3}>
								{dictionary(key)}: {dictionary(value)}
							</Text>
						))}
					</ButtonConfirm>
				</View>
			</StyledModal>
		</View>
	)
}

export default ModalEditMultiOrders
