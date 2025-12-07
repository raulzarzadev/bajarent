import { View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { onChangeItemSection } from '../firebase/actions/item-actions'
import {
	onWorkshopDeliveryRepair,
	onWorkshopRepairPending,
	onWorkshopRepairPickUp,
	onWorkshopRepairStart
} from '../firebase/actions/workshop-actions'
import { onAssignOrder, onRepairFinish, onRepairStart } from '../libs/order-actions'
import type { ItemExternalRepairProps } from '../types/ItemType'
import { workshop_status } from '../types/WorkshopType'
import Button from './Button'
import InputAssignSection from './InputAssingSection'
import ModalFixItem from './ModalFixItem'

const WorkshopItemActions = ({ item }: { item: Partial<ItemExternalRepairProps> }) => {
	const workshopStatus = item?.workshopStatus
	const failDescription = item?.repairDetails?.failDescription || item?.repairInfo || ''
	const { storeId } = useStore()
	const { user } = useAuth()

	const isExternalRepair = item?.isExternalRepair
	const handleAssignToSection = async ({ sectionId, sectionName }) => {
		if (item.isExternalRepair) {
			return await onAssignOrder({
				orderId: item.orderId,
				sectionId,
				sectionName,
				storeId,
				fromSectionName: 'Taller'
			})
		} else {
			return await onChangeItemSection({
				storeId,
				itemId: item.id,
				sectionId,
				sectionName,
				fromSectionId: 'workshop'
			})
		}
	}
	if (workshopStatus === workshop_status.pending) {
		//* this should move to picked up

		return (
			<View style={{ marginVertical: 8, width: '100%' }}>
				<Button
					label="Recoger"
					onPress={() => {
						onWorkshopRepairPickUp({
							storeId,
							itemId: item?.id,
							orderId: item?.orderId,
							isExternalRepair: item?.isExternalRepair,
							failDescription,
							userId: user.id
						})
					}}
				></Button>
			</View>
		)
	}
	if (workshopStatus === workshop_status.pickedUp) {
		//* this should move to finished
		return (
			<View style={{ marginVertical: 8, width: '100%' }}>
				{isExternalRepair && (
					<Button
						label="Regresar al cliente"
						variant="ghost"
						onPress={() => {
							onWorkshopRepairPending({
								storeId,
								itemId: item.id,
								orderId: item.orderId,
								isExternalRepair: item.isExternalRepair,
								failDescription,
								userId: user.id
							})
						}}
					></Button>
				)}
				<Button
					label="Iniciar reparación"
					onPress={() => {
						if (item?.isExternalRepair) {
							onRepairStart({
								orderId: item.orderId,
								userId: user.id,
								storeId
							})
						} else {
							onWorkshopRepairStart({
								storeId,
								itemId: item.id,
								orderId: item.orderId,
								failDescription,
								isExternalRepair: false,
								userId: user.id
							})
						}
					}}
				></Button>
			</View>
		)
	}
	if (workshopStatus === workshop_status.started) {
		//* this should move back to inProgress
		return (
			<View style={{ marginVertical: 8, width: '100%' }}>
				{isExternalRepair && (
					<Button
						label="Regresar al cliente"
						variant="ghost"
						onPress={() => {
							onWorkshopRepairPending({
								storeId,
								itemId: item.id,
								orderId: item.orderId,
								isExternalRepair: item.isExternalRepair,
								failDescription,
								userId: user.id
							})
						}}
					></Button>
				)}

				{!isExternalRepair && <ModalFixItem item={item} />}
				{isExternalRepair && (
					<Button
						label="Lista para entregar"
						onPress={() => {
							onRepairFinish({
								orderId: item.orderId,
								userId: user.id,
								storeId
							})
						}}
					></Button>
				)}
			</View>
		)
	}
	if (workshopStatus === workshop_status.finished) {
		//* this should move back to inProgress
		return (
			<View style={{ marginVertical: 8, width: '100%' }}>
				<View style={{ marginVertical: 8, width: '100%' }}>
					<InputAssignSection
						setNewSection={async ({ sectionId, sectionName }) => {
							try {
								await handleAssignToSection({ sectionId, sectionName })
							} catch (error) {
								console.log('error', error)
							}
							return
						}}
					/>
				</View>
				{/* **<--------- Regresar a reparación  ITEM */}
				{!isExternalRepair && <ModalFixItem item={item} />}

				{isExternalRepair && (
					<>
						<View style={{ marginVertical: 8, width: '100%' }}>
							{/* **<--------- Regresar a reparación ORDEN */}
							<ModalFixItem
								item={item}
								handleFix={({ comment }) => {
									onWorkshopRepairPickUp({
										storeId,
										itemId: item.id,
										orderId: item.orderId,
										isExternalRepair: true,
										failDescription: comment,
										userId: user?.id
									})
								}}
							/>
						</View>
						<View style={{ marginVertical: 8, width: '100%' }}>
							<Button
								label="Entregar "
								onPress={() => {
									onWorkshopDeliveryRepair({
										storeId,
										itemId: item.id,
										orderId: item.orderId,
										isExternalRepair: !!item.isExternalRepair,
										failDescription,
										userId: user?.id
									})
								}}
							></Button>
						</View>
					</>
				)}
			</View>
		)
	}
}

export default WorkshopItemActions
