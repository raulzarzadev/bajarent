import { View, Text, Pressable } from 'react-native'

import { ReactNode, useState } from 'react'
import Button from './Button'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
export type BasicExpandibleItemType = {
	id: string
	content?: string | ReactNode
}
export const ExpandibleList = <T extends BasicExpandibleItemType>({
	label,
	items = [],
	onPressRow,
	onPressTitle,
	defaultExpanded = false,
	renderItem
}: ExpandibleListProps<T>) => {
	const [expanded, setExpanded] = useState(defaultExpanded)

	const uniqueItems = removeDuplicates(items.map(i => i.id))
	const hasRenderItem = typeof renderItem === 'function'
	return (
		<View style={{ marginVertical: 8, marginHorizontal: 6 }}>
			<View style={{ flexDirection: 'row' }}>
				<Pressable onPress={onPressTitle}>
					<Text style={[gStyles.h3, { marginRight: 4 }]}>
						{label}
						{`(${items?.length || 0})`}
					</Text>
				</Pressable>
				<Button
					size="small"
					variant="ghost"
					justIcon
					color="accent"
					icon={expanded ? 'rowDown' : 'rowRight'}
					onPress={() => setExpanded(!expanded)}
				/>
			</View>

			{expanded &&
				uniqueItems.map((item, index) => {
					const itemData = items.find(i => i.id === item)
					const countItems = items.filter(i => i.id === item)?.length || 0

					if (hasRenderItem) return renderItem(itemData)
					return (
						<Pressable
							key={`${itemData.id}-${index}`}
							onPress={() => onPressRow(itemData.id)}
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								marginVertical: 2
							}}
						>
							<View style={{ width: 20 }}>
								{countItems > 1 && <Text style={[gStyles.tBold]}>{countItems}*</Text>}
							</View>
							<Text key={index}>{itemData?.content}</Text>
						</Pressable>
					)
				})}
		</View>
	)
}
const removeDuplicates = (arr: string[]) => Array.from(new Set(arr))

export type ExpandibleListProps<T> = {
	label: string
	items: T[] | BasicExpandibleItemType[]
	onPressRow: (id: string) => void
	onPressTitle?: () => void
	defaultExpanded?: boolean
	renderItem?: (item) => ReactNode
}
export const ExpandibleListE = <T extends BasicExpandibleItemType>(
	props: ExpandibleListProps<T>
) => (
	<ErrorBoundary componentName="ExpandibleList">
		<ExpandibleList {...props} />
	</ErrorBoundary>
)
export default ExpandibleList
