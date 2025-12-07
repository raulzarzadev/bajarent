import { Text, View } from 'react-native'
import theme from '../theme'

const BadgeOwner = ({ isOwner }) => {
	return (
		<View>
			{isOwner && (
				<View
					style={{
						borderRadius: 9999,
						backgroundColor: theme.success,
						width: 80,
						margin: 'auto',
						padding: 8
					}}
				>
					<Text
						style={{
							color: theme.white,
							fontWeight: 'bold',
							textAlign: 'center'
						}}
					>
						Dueño
					</Text>
				</View>
			)}
		</View>
	)
}

export default BadgeOwner
