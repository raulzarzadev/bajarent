import { useRoute } from '@react-navigation/native'
import { isToday } from 'date-fns'
import { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { useItemsCtx } from '../contexts/itemsContext'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import {
	onChangeItemSection,
	onCheckInInventory,
	onRetireItem
} from '../firebase/actions/item-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import useMyNav from '../hooks/useMyNav'
import asDate from '../libs/utils-date'
import { formatItems } from '../libs/workshop.libs'
import { gStyles } from '../styles'
import theme, { colors } from '../theme'
import type ItemType from '../types/ItemType'
import type { SectionType } from '../types/SectionType'
import ButtonConfirm from './ButtonConfirm'
import Icon from './Icon'
import InputAssignSection from './InputAssingSection'
import { ItemFixDetails } from './ItemDetails'
import { ListE } from './List'
import ListRow, { type ListRowField } from './ListRow'
import catchError from '../libs/catchError'

const OPACITY_ROW_COLOR = '66'

const ListStoreItems = ({
	allItemsSections,
	allItems,
	getAllAvailable
}: {
	allItemsSections?: string[]
	availableItemsSections?: string[]
	allItems?: boolean
	getAllAvailable?: boolean
}) => {
	const { params } = useRoute()
	const { permissions } = useEmployee()
	const [errors, setErrors] = useState<{ rentedItems?: string }>({})
	const { items } = useItemsCtx()
	const { toItems } = useMyNav()

	//@ts-expect-error
	const listItems = params?.ids

	const filteredItems = items?.filter(item => {
		// * FILTER BY LIST
		if (listItems?.length > 0) return listItems.includes(item.id)
		// * FILTER BY SECTION
		if (allItemsSections?.length > 0) {
			if (!allItemsSections.includes(item.assignedSection)) return false
		}
		// * FILTER BY AVAILABLE
		if (getAllAvailable) {
			if (item.status !== 'pickedUp') return false
		}
		// * FILTER BY ALL ITEMS
		if (!allItems) {
			if (item.status === 'retired') return false
		}
		return true
	})
	const { storeId, categories, sections: storeSections } = useStore()
	const { user } = useAuth()
	const [loading, setLoading] = useState(false)

	const handleDeleteItems = async (ids: string[]) => {
		const promises = ids.map(async id => {
			try {
				const res = await ServiceStoreItems.delete({ itemId: id, storeId })
				return res
			} catch (error) {
				console.error({ error })
				return error
			}
		})
		const res = await Promise.all(promises)

		setLoading(false)
		return res
	}
	const handleRetireItem = async (ids: string[]) => {
		const rentedItems = items.filter(item => item.status === 'rented')
		if (rentedItems.length) {
			setErrors({ rentedItems: 'cant retire rented items' })
			setTimeout(() => {
				setErrors({})
			}, 3000)
			return console.log('cant retire rented items')
		}
		const promises = ids.map(async id => {
			try {
				await onRetireItem({ storeId, itemId: id, userId: user?.id })
			} catch (error) {
				console.error({ error })
				return error
			}
		})
		const res = await Promise.all(promises)

		setLoading(false)
		return res
	}

	const handleAddInventoryEntry = async (ids: string[]) => {
		const promises = ids.map(async id => {
			try {
				await onCheckInInventory({ storeId, itemId: id, userId: user?.id })
			} catch (error) {
				console.error({ error })
				return error
			}
		})
		const [err, res] = await catchError(Promise.all(promises))
		console.log({ err, res })
		setLoading(false)
		return
	}

	const [formattedItems, setFormattedItems] = useState([])

	useEffect(() => {
		if (listItems?.length > 0) {
			ServiceStoreItems.getList({ storeId, ids: listItems }).then(res => {
				const formattedItems = formatItems(res, categories, storeSections)
				setFormattedItems(formattedItems)
			})
		} else {
			const formattedItems = formatItems(filteredItems, categories, storeSections)
			setFormattedItems(formattedItems)
		}
	}, [listItems])

	//const formattedItems = formatItems(filteredItems, categories, storeSections)

	const handleAssignItems = async (
		ids: string[],
		sectionId: SectionType['id'],
		sectionName: SectionType['name']
	) => {
		setLoading(true)

		const promises = ids.map(async id => {
			try {
				return onChangeItemSection({
					itemId: id,
					storeId,
					sectionId,
					sectionName,
					fromSectionId: formattedItems.find(item => item.id === id)?.assignedSection
				})
			} catch (error) {
				console.error({ error })
				return error
			}
		})
		const res = await Promise.all(promises)
		//  fetchItems({ fromCache: true })
		setLoading(false)
		return res
	}
	const canCreateItems = permissions?.items?.canCreate || permissions.isAdmin

	return (
		<View>
			<ListE
				id="list-store-items"
				maxWidth={1000}
				defaultOrder="des"
				defaultSortBy="number"
				data={formattedItems}
				pinRows={false}
				ComponentMultiActions={({ ids }) => (
					<View>
						<View style={{ marginVertical: 8 }}>
							<InputAssignSection
								currentSection=""
								disabled={loading}
								setNewSection={async ({ sectionId, sectionName }) => {
									await handleAssignItems(ids, sectionId, sectionName)
								}}
							/>
						</View>
						<View style={{ marginVertical: 8 }}>
							<ButtonConfirm
								openDisabled={loading}
								openLabel="Invetario"
								openVariant="outline"
								icon="inventory"
								text={`Se marcaran inventarios en los ${ids?.length || 0} artículos seleccionados`}
								handleConfirm={async () => handleAddInventoryEntry(ids)}
							/>
						</View>

						<View style={{ marginVertical: 8 }}>
							{!!errors?.rentedItems && (
								<Text
									style={{
										color: theme.error,
										marginVertical: 6,
										textAlign: 'center'
									}}
								>
									*No se pueden dar de BAJA artículos en renta
								</Text>
							)}
							<ButtonConfirm
								openDisabled={loading}
								openLabel="Dar de baja"
								openColor="secondary"
								openVariant="outline"
								icon="download"
								text={`Se daran de baja ${ids?.length || 0} artículos seleccionados`}
								handleConfirm={async () => {
									await handleRetireItem(ids)
									return
								}}
							/>
						</View>
						<View style={{ marginVertical: 8 }}>
							<ButtonConfirm
								openDisabled={loading}
								openLabel="Eliminar"
								openColor="error"
								openVariant="outline"
								icon="delete"
								text={`Se eliminaran los ${ids?.length || 0} artículos seleccionados`}
								handleConfirm={async () => {
									await handleDeleteItems(ids)
									return
								}}
							/>
						</View>
					</View>
				)}
				sideButtons={[
					{
						icon: 'add',
						onPress() {
							toItems({ to: 'new', screenNew: true })
						},
						label: 'Agregar',
						visible: canCreateItems
					}
				]}
				filters={[
					{ field: 'assignedSectionName', label: 'Area' },
					{ field: 'categoryName', label: 'Categoría' },
					{ field: 'brand', label: 'Marca' },
					{ field: 'status', label: 'Estado' },
					{
						field: 'needFix',
						label: 'Necesita Reparación',
						boolean: true,
						color: colors.red,
						icon: 'wrench',
						titleColor: colors.white
					},
					{
						field: 'isRented',
						label: 'En renta',
						boolean: true,
						color: `${theme.success}${OPACITY_ROW_COLOR}`,
						icon: 'rent'
					},
					{
						field: 'isPickedUp',
						label: 'Recogido',
						boolean: true,
						color: `${theme.primary}${OPACITY_ROW_COLOR}`,
						icon: 'truck'
					},
					{
						field: 'checkedInInventory',
						label: 'Inventariado hoy',
						boolean: true,
						color: `${colors.pink}${OPACITY_ROW_COLOR}`,
						icon: 'inventory'
					}
				]}
				sortFields={[
					{ key: 'number', label: 'Número' },
					{ key: 'categoryName', label: 'Categoría' },
					{ key: 'assignedSectionName', label: 'Area' },
					{ key: 'brand', label: 'Marca' },
					{ key: 'serial', label: 'Serial' },
					{ key: 'status', label: 'Estado' }
				]}
				onPressRow={rowId => {
					toItems({ id: rowId, to: 'details' })
				}}
				ComponentRow={({ item }) => {
					if (!item) return null
					return <RowItem item={item} />
				}}
				collectionSearch={{
					collectionName: 'items',
					fields: ['number', 'serial', 'brand', 'model', 'status']
				}}
			/>
		</View>
	)
}

const RowItem = ({ item }: { item: Partial<ItemType> }) => {
	const needFix = item?.needFix
	const bgcolor: Record<ItemType['status'], string> = {
		rented: theme.success,
		pickedUp: theme.primary,
		retired: theme.neutral
	}
	const inventoryCheckedToday = isToday(asDate(item?.lastInventoryAt))
	const isBigScreen = Dimensions.get('window').width > 600

	const rowFields: ListRowField[] = [
		{
			width: '20%',
			component: (
				<View style={{ flexDirection: isBigScreen ? 'row' : 'column' }}>
					<View style={{ width: 18 }}>
						{inventoryCheckedToday && <Icon icon={'inventory'} color={colors.black} size={16} />}
					</View>
					<View style={{ alignItems: 'center', flex: 1 }}>
						<Text style={{ marginRight: 8 }}>{item?.number}</Text>
						<Text style={gStyles.helper}>{item?.serial}</Text>
					</View>
				</View>
			)
		},
		{ width: '20%', component: <Text>{item.assignedSectionName}</Text> },
		{
			width: '20%',
			component: (
				<View>
					<Text>{item.categoryName}</Text>
					<Text style={gStyles.helper}>{item?.brand}</Text>
				</View>
			)
		},
		{
			width: 'rest',
			component: <Text>{dictionary(item?.status)}</Text>
		}
	]
	if (isBigScreen) {
		rowFields.push({
			width: '30%',
			component: (
				<View>
					{!!needFix && (
						<View
							style={
								{
									// justifyContent: 'flex-end',
									// width: '100%',
									// alignItems: 'flex-end'
								}
							}
						>
							<ItemFixDetails itemId={item?.id} size="sm" />
						</View>
					)}
				</View>
			)
		})
	} else {
		rowFields.push({
			width: 'rest',
			component: (
				<View>
					{!!needFix && (
						<View>
							<Icon icon="wrench" color={colors.red} size={14} />
						</View>
					)}
				</View>
			)
		})
	}

	return (
		<ListRow
			style={{
				padding: 4,
				borderRadius: 5,
				borderWidth: 2,
				width: '100%',
				marginVertical: 2,
				borderColor: needFix ? colors.red : 'transparent',
				backgroundColor: `${bgcolor[item.status]}${OPACITY_ROW_COLOR}`
			}}
			fields={rowFields}
		/>
	)
}

export default ListStoreItems
