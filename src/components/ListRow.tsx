import type { ReactNode } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import theme from '../theme'
export type ListRowField = {
	width: ViewStyle['width'] | 'rest'
	component: ReactNode
}

const ListRow = ({ fields, style }: { fields: ListRowField[]; style?: ViewStyle }) => {
	return (
		<View style={[styles.container, style]}>
			{fields?.map(({ component, width }, i) => {
				let style = {}
				if (width === 'rest') {
					style = { flex: 1 }
				} else {
					style = { width }
				}
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: any
					<View style={style} key={i}>
						{component}
					</View>
				)
			})}
		</View>
	)
}

export default ListRow

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 4,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		borderWidth: 1,
		borderColor: theme.neutral,
		width: '100%',
		// maxWidth: 500,
		marginHorizontal: 'auto',
		flexWrap: 'wrap'
	}
})
