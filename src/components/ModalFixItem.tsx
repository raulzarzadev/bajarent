import { useState } from 'react'
import { Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { onFixItem, onReportItem } from '../firebase/actions/workshop-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { gStyles } from '../styles'
import type ItemType from '../types/ItemType'
import ButtonConfirm from './ButtonConfirm'
import InputTextStyled from './InputTextStyled'

const MIN_COMMENT_LENGTH = 10
export type HandleFixProps = {
	comment: string
}
const ModalFixItem = ({
	item,
	disabled,
	disabledFix,
	handleFix
}: {
	item: Partial<ItemType>
	disabled?: boolean
	disabledFix?: boolean
	handleFix?: (handleFixProps?: HandleFixProps) => void
}) => {
	const needFix = item?.needFix

	const { storeId } = useStore()
	const [comment, setComment] = useState('')
	const handleMarkAsNeedFix = async () => {
		if (!item.isExternalRepair) {
			if (needFix) {
				onFixItem({
					storeId,
					itemId: item.id,
					fixDescription: comment
				})
			} else {
				onReportItem({
					storeId,
					itemId: item.id,
					failDescription: comment
				})
			}
		} else {
			console.log('is a external repair')
		}
		handleFix?.({ comment })
		setComment('')
	}

	return (
		<View>
			<View style={{ margin: 2 }}>
				{needFix ? (
					<ButtonConfirm
						openDisabled={disabled || disabledFix}
						openSize="small"
						icon="wrench"
						openColor={'error'}
						openVariant={'filled'}
						modalTitle="Descripción de reparación"
						handleConfirm={async () => {
							return await handleMarkAsNeedFix()
						}}
					>
						<Text style={gStyles.h3}>Reparada</Text>
						<InputTextStyled
							style={{ marginVertical: 6 }}
							placeholder="Descripción"
							label="Descripción"
							onChangeText={value => setComment(value)}
						></InputTextStyled>
					</ButtonConfirm>
				) : (
					<ButtonConfirm
						openDisabled={disabled || disabledFix}
						openSize="small"
						icon="wrench"
						openColor={'primary'}
						openVariant={'outline'}
						handleConfirm={async () => {
							return await handleMarkAsNeedFix()
						}}
						confirmColor="error"
						modalTitle={`Describe la falla ${item.number}`}
						confirmDisabled={isLongEnough(comment, MIN_COMMENT_LENGTH)}
					>
						<InputTextStyled
							style={{ marginVertical: 6 }}
							placeholder="Descripción"
							label="Descripción"
							onChangeText={value => setComment(value)}
						></InputTextStyled>
						{isLongEnough(comment, MIN_COMMENT_LENGTH) && (
							<Text style={[gStyles.tError, { marginBottom: 8 }]}>
								*La descripción debe tener al menos {MIN_COMMENT_LENGTH} caracteres
							</Text>
						)}
					</ButtonConfirm>
				)}
			</View>
		</View>
	)
}

export const isLongEnough = (text: string, length: number) => {
	return text.length < length
}

export const markItemAsNeedFix = async ({
	itemId,
	storeId,
	needsFix, // it needs fix or it has been fixed ?
	comment,
	markAsRepairing
}: {
	itemId: string
	storeId: string
	needsFix: boolean
	comment: string
	markAsRepairing?: boolean
}) => {
	try {
		await ServiceStoreItems.update({
			itemId,
			storeId,
			itemData: {
				needFix: needsFix,
				workshopStatus: markAsRepairing ? 'started' : needsFix ? 'pending' : 'finished'
			}
		})

		await ServiceStoreItems.addEntry({
			storeId,
			itemId,
			entry: {
				type: !needsFix ? 'fix' : 'report',
				content: comment,
				itemId
			}
		})
		return
	} catch (error) {
		console.log('error', error)
		return
	}
}

export default ModalFixItem
