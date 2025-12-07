import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'
import Button from './Button'

const SpanCopy = ({ label = '', copyValue, content = '' }) => {
	const [copied, setCopied] = React.useState(false)
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			{/* <Text style={{ fontWeight: 'bold', marginRight: 4 }}>{label}</Text> */}
			<Text>{content}</Text>
			<View style={{ position: 'relative' }}>
				<Button
					label={label}
					icon="copy"
					//justIcon
					variant="ghost"
					size="small"
					onPress={() => {
						//@ts-expect-error
						navigator.clipboard.writeText(copyValue)
						setCopied(true)
						setTimeout(() => {
							setCopied(false)
						}, 2000)
					}}
				/>
				{copied && (
					<View
						style={[
							{
								position: 'absolute',
								top: -4,
								right: 0,
								backgroundColor: colors.emerald,
								padding: 3,
								borderRadius: 4
							}
						]}
					>
						<Text>Copiado!</Text>
					</View>
				)}
			</View>
		</View>
	)
}

export default SpanCopy

const styles = StyleSheet.create({})
