import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import dictionary, { asCapitalize } from '../dictionary'
import { type ItemHistoryType, ServiceItemHistory } from '../firebase/ServiceItemHistory'
import { useShop } from '../hooks/useShop'
import asDate, { dateFormat } from '../libs/utils-date'
import { gStyles } from '../styles'
import theme from '../theme'
import type ItemType from '../types/ItemType'
import { item_color_status } from '../types/ItemType'
import Chip from './Chip'
import DocMetadata from './DocMetadata'
import ErrorBoundary from './ErrorBoundary'
import ItemActions from './ItemActions'
import SpanUser from './SpanUser'

const ItemDetails = ({
	item,
	onAction,
	showFixTime = true
}: {
	item: Partial<ItemType>
	onAction?: () => void
	showFixTime?: boolean
}) => {
	return (
		<View>
			<DocMetadata item={item} style={{ flexDirection: 'row', justifyContent: 'space-between' }} />
			<ItemDetailsResumed item={item} />

			<Text
				style={{
					textAlign: 'center',
					justifyContent: 'center',
					marginVertical: 8
				}}
			>
				Ultimo inventario: {dateFormat(asDate(item?.lastInventoryAt), 'dd/MMM/yy HH:mm')} por{' '}
				<SpanUser userId={item?.lastInventoryBy} />
			</Text>

			{item.workshopStatus && item.assignedSection === 'workshop' && item.status === 'pickedUp' && (
				<Text style={[gStyles.tCenter, { marginBottom: 6 }]}>
					<Text style={gStyles.helper}>{asCapitalize(dictionary(item.workshopStatus))}</Text>
				</Text>
			)}

			<View style={{ marginBottom: 8 }}>
				<ItemActions
					item={item}
					actions={['assign', 'fix', 'edit', 'delete', 'retire', 'history', 'inventory']}
					onAction={() => {
						onAction?.()
					}}
				/>
			</View>

			{item?.needFix && (
				<View style={{ marginVertical: 12 }}>
					<ItemFixDetails itemId={item?.id} showTime={showFixTime} />
				</View>
			)}
		</View>
	)
}

export const ItemDetailsResumed = ({
	item,
	showStatus = true
}: {
	item: Partial<ItemType>
	showStatus?: boolean
}) => {
	const { shop } = useShop()
	const preferView = shop?.preferences?.itemIdentifier || 'economicNumber'

	const getPreferredIdentifier = () => {
		if (preferView === 'serialNumber') return item.serial.trim() || 'Sin SERIE'
		if (preferView === 'sku') return item.sku.trim() || 'Sin SKU'
		return item.number.trim() || 'Sin ECO'
	}

	const getSecondaryInfo = () => {
		const info: string[] = []
		if (preferView !== 'economicNumber' && item.number) {
			info.push(`#${item.number.trim()}`)
		}
		if (preferView !== 'serialNumber' && item.serial) {
			info.push(`Serie: ${item.serial.trim()}`)
		}
		if (preferView !== 'sku' && item.sku) {
			info.push(`SKU: ${item.sku.trim()}`)
		}
		return info.join(' • ')
	}

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 8,
					height: 18
				}}
			>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					{!!showStatus && (
						<Chip
							title={dictionary(item.status)}
							color={item_color_status[item.status]}
							size="xs"
							style={{ flex: 1, paddingHorizontal: 16 }}
						/>
					)}
				</View>
				<View>{!!item?.needFix && <Chip icon="wrench" color={theme.error} size="xs" />}</View>
			</View>

			<Text style={[gStyles.h1, { fontSize: 22, textAlign: 'center', marginVertical: 2 }]}>
				{getPreferredIdentifier()}
			</Text>

			<Text style={gStyles.h3}>
				{item?.categoryName} <Text style={gStyles.helper}>{item.brand}</Text>
			</Text>

			{!!getSecondaryInfo() && (
				<Text style={[gStyles.helper, { textAlign: 'center', marginTop: 4 }]}>
					{getSecondaryInfo()}
				</Text>
			)}
		</View>
	)
}

export const ItemFixDetails = ({
	itemId,
	size = 'lg',
	showTime = true,
	failDescription
}: ItemFixDetailsProps) => {
	const [lastFixEntry, setLastFixEntry] = useState<ItemHistoryType>()
	const { storeId } = useStore()

	useEffect(() => {
		//* FIXME: here you are make one call for
		ServiceItemHistory.getLastEntries({
			itemId,
			storeId,
			count: 1,
			type: 'report'
		}).then(res => {
			setLastFixEntry(res[0])
		})
	}, [])
	const textSize = {
		sm: 10,
		md: 14,
		lg: 18
	}

	if (failDescription)
		return (
			<Text style={[gStyles.tError, gStyles.tCenter, { fontSize: textSize[size] }]}>
				{failDescription}
			</Text>
		)
	if (lastFixEntry === undefined) return null
	return (
		<View>
			<View
				style={{
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
					//marginVertical: 12
				}}
			>
				<Text
					numberOfLines={3}
					style={[gStyles.tError, gStyles.tCenter, { fontSize: textSize[size] }]}
				>
					{showTime ? dateFormat(lastFixEntry?.createdAt, 'dd/MMM/yy HH:mm ') : ''}{' '}
					{lastFixEntry.content}
				</Text>
			</View>
		</View>
	)
}

export type ItemFixDetailsProps = {
	itemId: string
	size?: 'sm' | 'md' | 'lg'
	showTime?: boolean
	failDescription?: string
}
export const ItemFixDetailsE = (props: ItemFixDetailsProps) => (
	<ErrorBoundary componentName="ItemFixDetails">
		<ItemFixDetails {...props} />
	</ErrorBoundary>
)

export const ItemDetailsE = props => (
	<ErrorBoundary componentName="ItemDetails">
		<ItemDetails {...props} />
	</ErrorBoundary>
)

export default ItemDetails
