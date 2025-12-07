import { View, Text } from 'react-native'
import theme from '../theme'

const BadgeAdmin = ({ isAdmin }) => {
	return (
		<View>
			{isAdmin && (
				<View
					style={{
						borderRadius: 9999,
						backgroundColor: theme.secondary,
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
						Admin
					</Text>
				</View>
			)}
		</View>
	)
}

export default BadgeAdmin
