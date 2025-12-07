import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { gSpace } from '../styles'
import theme from '../theme'
import type ItemType from '../types/ItemType'
import type OrderType from '../types/OrderType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import type { ItemSelected } from './FormSelectItem'
import ModalChangeItem from './ModalChangeItem'
import ModalCreateOrderItem from './ModalCreateOrderItem'
import RowItem from './RowItem'

export const RowOrderItem = ({
	item,
	onPressDelete,
	onEdit,
	order,
	itemId
}: {
	order: Partial<OrderType>
	item: ItemSelected
	onPressDelete?: () => void
	onEdit?: (values: ItemSelected) => void | Promise<void>
	itemId?: string
}) => {
	const { storeId } = useStore()

	const orderId = order.id

	const [itemServerData, setItemServerData] = useState<Partial<ItemType>>()

	const [_item, _setItem] = useState<ItemSelected>(undefined)

	useEffect(() => {
		ServiceStoreItems.get({ itemId, storeId }).then(res => {
			setItemServerData(res)
		})
	}, [itemId])

	const [loading] = useState(false)
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<ModalChangeItem itemId={itemId} orderId={orderId} disabled={loading} />

				<RowItem
					item={
						itemServerData
							? {
									...itemServerData,
									priceSelected: item.priceSelected,
									priceQty: item.priceQty,
									priceSelectedId: item.priceSelectedId
								}
							: item
					}
					style={{
						marginVertical: gSpace(2),
						marginHorizontal: gSpace(2),
						justifyContent: 'space-between',
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: theme.info,
						paddingHorizontal: gSpace(2),
						paddingVertical: gSpace(1),
						borderRadius: gSpace(2)
					}}
				/>

				<ModalCreateOrderItem itemId={itemId} />

				{!!onEdit && (
					<ButtonConfirm
						handleConfirm={async () => {}}
						confirmLabel="Cerrar"
						confirmVariant="outline"
						openSize="small"
						openColor="info"
						icon="edit"
						justIcon
						modalTitle="Editar item"
						confirmDisabled={loading}
					>
						<View style={{ marginBottom: 8 }}>
							<FormItem
								values={_item}
								onSubmit={async values => {
									return await onEdit(values)
								}}
							/>
						</View>
					</ButtonConfirm>
				)}

				{!!onPressDelete && (
					<Button
						buttonStyles={{ marginLeft: gSpace(2) }}
						icon="sub"
						color="error"
						justIcon
						onPress={onPressDelete}
						size="small"
						disabled={loading}
					/>
				)}
			</View>
		</View>
	)
}

export default RowOrderItem
