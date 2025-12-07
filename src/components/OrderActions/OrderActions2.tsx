import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { useStore } from '../../contexts/storeContext'
import { onRegistryEntry } from '../../firebase/actions/item-actions'
import { ServiceCustomers } from '../../firebase/ServiceCustomers'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { ServiceStoreItems } from '../../firebase/ServiceStoreItems'
import useModal from '../../hooks/useModal'
import useMyNav from '../../hooks/useMyNav'
import {
	onAuthorize,
	onCancel,
	onComment,
	onRepairCancelPickup,
	onRepairDelivery,
	onRepairFinish
} from '../../libs/order-actions'
import { onSendOrderWhatsapp } from '../../libs/whatsapp/sendOrderMessage'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { gSpace, gStyles } from '../../styles'
import { ItemStatuses } from '../../types/ItemType'
import type OrderType from '../../types/OrderType'
import { order_status, order_type } from '../../types/OrderType'
import type UserType from '../../types/UserType'
import Button, { type ButtonProps } from '../Button'
import ButtonConfirm from '../ButtonConfirm'
import ErrorBoundary from '../ErrorBoundary'
import InputTextStyled from '../InputTextStyled'
import { ModalPaymentSale } from '../ModalPaymentSale'
import checkIfAllItemsExists from './libs/checkIfAllItemsExists'
import ModalRentFinish from './ModalRentFinish'
import ModalRentStart from './ModalRentStart'
import ModalStartRepair from './ModalRepairStart'

//* repaired
function OrderActions() {
	const { order } = useOrderDetails()
	const orderType = order?.type
	return (
		<View style={{ marginBottom: gSpace(4) }}>
			{orderType === order_type.REPAIR && <RepairOrderActions order={order} />}
			{orderType === order_type.RENT && <RentOrderActions order={order} />}
			{orderType === order_type.SALE && <SaleOrderActions order={order} />}
		</View>
	)
}

export default OrderActions
export const OrderActionsE = props => (
	<ErrorBoundary componentName="OrderActions">
		<OrderActions {...props} />
	</ErrorBoundary>
)

const RepairOrderActions = ({ order }: { order: OrderType }) => {
	const { user, storeId } = useAuth()
	const { addWork } = useCurrentWork()

	const status = order?.status
	const isDelivered = status === order_status.DELIVERED
	const isRepaired = status === order_status.REPAIRED
	const isRepairing = status === order_status.REPAIRING
	const isAuthorized = status === order_status.AUTHORIZED
	const modalRepairStart = useModal({ title: 'Comenzar reparación' })
	return (
		<ScrollView horizontal style={styles.scrollView}>
			<ModalStartRepair modal={modalRepairStart} />
			<View style={styles.container}>
				<ButtonAction
					isSelected={isAuthorized}
					selectedLabel="Pedido"
					unselectedLabel="Pedido"
					color="success"
					onPress={async () => {
						onRepairCancelPickup({
							orderId: order.id,
							userId: user.id,
							storeId
						})
						addWork({
							work: {
								action: 'repair_authorized',
								type: 'order',
								details: {
									orderId: order.id,
									sectionId: order?.assignToSection ?? null
								}
							}
						})
					}}
				/>
				<ButtonAction
					isSelected={isRepairing}
					selectedLabel="Reparando"
					unselectedLabel="Iniciar"
					onPress={() => {
						modalRepairStart.toggleOpen()
					}}
				/>

				<ButtonAction
					isSelected={isRepaired}
					selectedLabel="Reprada "
					unselectedLabel="Terminar "
					onPress={async () => {
						addWork({
							work: {
								action: 'repair_finish',
								type: 'order',
								details: {
									orderId: order.id,
									sectionId: order?.assignToSection ?? null
								}
							}
						})
						await onRepairFinish({
							orderId: order.id,
							userId: user.id,
							storeId
						}).catch(console.error)
					}}
				/>
				<ButtonAction
					isSelected={isDelivered}
					selectedLabel="Entregado "
					unselectedLabel="Entregar "
					onPress={async () => {
						addWork({
							work: {
								action: 'repair_delivered',
								type: 'order',
								details: {
									orderId: order.id,
									sectionId: order?.assignToSection ?? null
								}
							}
						})
						await onRepairDelivery({
							orderId: order.id,
							userId: user.id,
							storeId
						})
					}}
				/>
			</View>
		</ScrollView>
	)
}

const SaleOrderActions = ({ order }: { order: OrderType }) => {
	const { permissions } = useEmployee()
	const { user } = useAuth()

	const orderStatus = order?.status

	const cancelDelivery = permissions?.orders.canCancelPickedUp && orderStatus === 'DELIVERED'
	const delivery =
		(permissions?.orders.canDelivery || permissions.isAdmin) && orderStatus === 'AUTHORIZED'

	return (
		<>
			<ScrollView style={[{ width: '100%', margin: 'auto' }]}>
				<View
					style={{
						flexDirection: 'row',
						minWidth: '100%',
						justifyContent: 'space-around'
					}}
				>
					{cancelDelivery && <ButtonCancelDelivery order={order} user={user} />}
					{delivery && order.type === order_type.RENT && <ButtonDeliveryRent />}
					{delivery && order.type === order_type.SALE && <ButtonDeliverySale />}
				</View>
			</ScrollView>
		</>
	)
}
const RentOrderActions = ({ order }: { order: OrderType }) => {
	const { permissions } = useEmployee()
	const { user } = useAuth()

	const orderStatus = order?.status
	const authorize =
		(permissions?.orders.canAuthorize || permissions.isAdmin) &&
		(orderStatus === 'PENDING' || orderStatus === 'CANCELLED')

	const cancel =
		(permissions?.orders.canCancel || permissions.isAdmin) && orderStatus === 'AUTHORIZED'
	const cancelDelivery = permissions?.orders.canCancelPickedUp && orderStatus === 'DELIVERED'
	const delivery =
		(permissions?.orders.canDelivery || permissions.isAdmin) && orderStatus === 'AUTHORIZED'
	const pickUp =
		(permissions?.orders.canPickup || permissions.isAdmin) && orderStatus === 'DELIVERED'
	const renew = (permissions?.orders.canRenew || permissions.isAdmin) && orderStatus === 'DELIVERED'
	const cancelPickUp =
		(permissions?.orders.canCancelPickedUp || permissions.isAdmin) && orderStatus === 'PICKED_UP'
	return (
		<>
			<ScrollView style={[{ width: '100%', margin: 'auto' }]}>
				<View
					style={{
						flexDirection: 'row',
						minWidth: '100%',
						justifyContent: 'space-around'
					}}
				>
					{authorize && <ButtonAuthorize order={order} user={user} />}
					{cancel && <ButtonCancel order={order} user={user} />}
					{cancelDelivery && <ButtonCancelDelivery order={order} user={user} />}
					{delivery && <ButtonDeliveryRent />}
					{pickUp && <ButtonPickUp />}
					{renew && <ButtonRenew order={order} user={user} />}
					{cancelPickUp && <ButtonCancelPickUp order={order} user={user} />}
				</View>
			</ScrollView>
		</>
	)
}

const ButtonCancelDelivery = ({ order, user }) => {
	const { addWork } = useCurrentWork()
	return (
		<View style={{ marginVertical: 'auto' }}>
			<ButtonConfirm
				openLabel="Cancelar entrega"
				confirmColor="warning"
				confirmVariant="outline"
				confirmLabel="Cancelar entrega"
				icon="undo"
				openColor="warning"
				openVariant="outline"
				//openSize=""
				text="¿Estás seguro de que quieres cancelar entrega?"
				handleConfirm={async () => {
					addWork({
						work: {
							action: 'rent_delivered_canceled',
							type: 'order',
							details: {
								orderId: order.id,
								sectionId: order?.assignToSection ?? null
							}
						}
					})
					//* UPDATE ORDER
					ServiceOrders.update(order.id, {
						status: order_status.AUTHORIZED,
						deliveredAt: null,
						deliveredBy: null
					})
						.then(r => console.log(r))
						.catch(e => console.log(e)) //* COMMENT ORDER
					onComment({
						content: 'Entrega cancelada',
						orderId: order.id,
						storeId: order.storeId,
						type: 'comment',
						isOrderMovement: true
					})
						.then(r => console.log(r))
						.catch(e => console.log(e))
					order?.items?.forEach(item => {
						//* UPDATE ITEM AND CREATE HISTORY ENTRY
						ServiceStoreItems.update({
							itemId: item.id,
							storeId: order.storeId,
							itemData: { status: ItemStatuses.pickedUp }
						})
							.then(r => console.log(r))
							.catch(e => console.log(e))
						onRegistryEntry({
							itemId: item.id,
							storeId: order.storeId,
							type: 'pickup',
							orderId: order.id,
							content: 'Entrega cancelada'
						})
							.then(r => console.log(r))
							.catch(e => console.log(e))
					})
				}}
			/>
		</View>
	)
}

const ButtonRenew = ({ order, user }) => {
	const { toOrders } = useMyNav()

	return (
		<Button
			label="Renovar"
			icon="refresh"
			color="secondary"
			onPress={async () => {
				toOrders({ screen: 'renew', id: order.id })
			}}
		/>
	)
}

const ButtonDeliverySale = () => {
	const { order } = useOrderDetails()

	return (
		<View>
			<ModalPaymentSale orderId={order.id} />
		</View>
	)
}
const ButtonDeliveryRent = () => {
	const modalRentStart = useModal({ title: 'Comenzar renta' })
	return (
		<View>
			<Button label="Entregar" onPress={modalRentStart.toggleOpen} icon="home" color="success" />
			<ModalRentStart modal={modalRentStart} />
		</View>
	)
}

const ButtonPickUp = ({}) => {
	const { order } = useOrderDetails()
	const modalRentFinish = useModal({ title: 'Terminar renta' })
	const [allItemsExists, setAllItemsExists] = useState(false)

	useEffect(() => {
		checkIfAllItemsExists({ order }).then(res => setAllItemsExists(res))
	}, [order.items])
	return (
		<View>
			{!allItemsExists && (
				<Text style={[gStyles.tError, gStyles.tCenter]}>*Algun artículo no existe</Text>
			)}
			<Button
				disabled={!allItemsExists}
				label="Recoger"
				onPress={modalRentFinish.toggleOpen}
				icon="truck"
			/>
			<ModalRentFinish modal={modalRentFinish} />
		</View>
	)
}

const ButtonCancel = ({ order, user }: { order: OrderType; user: UserType }) => {
	const { addWork } = useCurrentWork()
	const [comment, setComment] = useState('')
	const MIN_COMMENT_LENGTH = 10
	return (
		<View>
			<View style={{ marginVertical: 'auto' }}>
				<ButtonConfirm
					modalTitle="Cancelar pedido"
					openLabel="Cancelar "
					confirmColor="error"
					confirmVariant="outline"
					confirmLabel="Cancelar pedido "
					icon="cancel"
					openColor="accent"
					openVariant="ghost"
					confirmDisabled={!(comment.length > MIN_COMMENT_LENGTH)}
					// openSize="small"
					text="¿Estás seguro de que quieres cancelar este pedido?"
					handleConfirm={async () => {
						const res = {
							orderId: order.id,
							userId: user.id,
							storeId: order.storeId,
							cancelledReason: comment
						}
						onCancel(res)
						addWork({
							work: {
								action: 'rent_canceled',
								type: 'order',
								details: {
									orderId: order.id,
									sectionId: order?.assignToSection ?? null
								}
							}
						})
					}}
				>
					<View style={{ marginBottom: 8 }}>
						<InputTextStyled
							label="Motivo"
							onChangeText={value => setComment(value)}
							value={comment}
							helperText={
								comment.length < MIN_COMMENT_LENGTH && `*Mínimo ${MIN_COMMENT_LENGTH} caracteres`
							}
							helperTextColor="error"
						></InputTextStyled>
					</View>
				</ButtonConfirm>
			</View>
		</View>
	)
}
const ButtonCancelPickUp = ({ order, user }) => {
	const { addWork } = useCurrentWork()
	return (
		<View style={{ marginVertical: 'auto' }}>
			<ButtonConfirm
				openLabel="Cancelar recolección "
				confirmColor="error"
				confirmVariant="outline"
				confirmLabel="Cancelar recolección"
				icon="undo"
				openColor="error"
				openVariant="outline"
				// openSize="small"
				text="¿Estás seguro de que quieres cancelar la recolección?"
				handleConfirm={async () => {
					addWork({
						work: {
							action: 'rent_picked_up_canceled',
							type: 'order',
							details: {
								orderId: order.id,
								sectionId: order?.assignToSection ?? null
							}
						}
					})
					//* UPDATE ORDER
					ServiceOrders.update(order.id, {
						status: order_status.DELIVERED,
						pickedUpAt: null,
						pickedUpBy: null
					})
						.then(r => console.log(r))
						.catch(e => console.log(e)) //* COMMENT ORDER
					onComment({
						content: 'Recolección cancelada',
						orderId: order.id,
						storeId: order.storeId,
						type: 'comment',
						isOrderMovement: true
					})
						.then(r => console.log(r))
						.catch(e => console.log(e))
					order?.items?.forEach(item => {
						//* UPDATE ITEM AND CREATE HISTORY ENTRY
						ServiceStoreItems.update({
							itemId: item.id,
							storeId: order.storeId,
							itemData: { status: ItemStatuses.rented }
						})
							.then(r => console.log(r))
							.catch(e => console.log(e))
						onRegistryEntry({
							itemId: item.id,
							storeId: order.storeId,
							type: 'delivery',
							orderId: order.id,
							content: 'Recolección cancelada'
						})
							.then(r => console.log(r))
							.catch(e => console.log(e))
					})
				}}
			/>
		</View>
	)
}

const ButtonAction = ({
	selectedLabel,
	unselectedLabel,
	isSelected,
	disabled,
	color,
	onPress
}: {
	selectedLabel: string
	unselectedLabel: string
	isSelected: boolean
	disabled?: boolean
	onPress: () => void
	color?: ButtonProps['color']
}) => {
	return (
		<Button
			variant={isSelected ? 'filled' : 'outline'}
			disabled={isSelected || disabled}
			label={isSelected ? selectedLabel : unselectedLabel}
			onPress={() => {
				onPress()
			}}
			color={color}
			buttonStyles={styles.button}
		></Button>
	)
}

const ButtonAuthorize = ({ order, user }) => {
	const { addWork } = useCurrentWork()
	const { store } = useStore()
	//TODO: send whatsapp when order is authorized, complement with route and date of delivery
	return (
		<Button
			label="Autorizar"
			onPress={async () => {
				await onAuthorize({
					orderId: order.id,
					userId: user.id,
					storeId: order.storeId
				})
				addWork({
					work: {
						action: 'rent_authorized',
						type: 'order',
						details: {
							orderId: order.id,
							sectionId: order?.assignToSection ?? null
						}
					}
				})
				const customer = await ServiceCustomers.get(order.customerId)
				onSendOrderWhatsapp({
					order,
					type: 'sendAuthorizedOrder',
					store,
					userId: user.id,
					customer
				})
			}}
		/>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		maxWidth: '100%',
		marginHorizontal: 'auto'
	},
	container: {
		flexDirection: 'row'
	},
	button: {
		margin: 4,
		width: 100
	}
})
