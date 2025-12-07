import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon, { IconName } from './Icon'
import theme, { colors } from '../theme'
import { gStyles } from '../styles'

export type TextIconType = 'info' | 'error' | 'success' | 'warning'
export type TextInfoProps = {
	type?: TextIconType
	text: string
	defaultVisible?: boolean
}
const TextInfo = ({ type = 'info', text, defaultVisible = false }: TextInfoProps) => {
	const icons: Record<TextIconType, IconName> = {
		info: 'info',
		error: 'cancel',
		success: 'done',
		warning: 'warning'
	}
	const textColor: Record<TextIconType, string> = {
		info: colors.darkGray,
		error: colors.white,
		success: colors.white,
		warning: colors.darkGray
	}
	const [visible, setVisible] = React.useState(!!defaultVisible)

	return (
		<View
			style={{
				//justifyContent: 'flex-start',
				margin: 'auto',

				marginVertical: 4,
				backgroundColor: theme?.[type],
				padding: 4,
				borderRadius: 4,
				width: visible ? 'auto' : 30
			}}
		>
			<Pressable
				style={{ alignItems: 'center', flexDirection: 'row' }}
				onPress={() => setVisible(!visible)}
			>
				<Icon icon={icons[type]} color={textColor[type]} size={22} />

				<Text
					style={[
						gStyles.helper,
						{ color: textColor[type], fontWeight: 'bold', marginLeft: 8 },
						{ display: visible ? 'flex' : 'none' }
					]}
				>
					{text}
				</Text>
			</Pressable>
		</View>
	)
}

export default TextInfo

const styles = StyleSheet.create({
	text: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		textAlign: 'center',
		verticalAlign: 'center'
	}
})
