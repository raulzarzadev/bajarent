import { View } from 'react-native'
import LinkEmail from './LinkEmail'

const CardEma = ({ email }: { email: string }) => {
	return (
		<View style={{ justifyContent: 'center' }}>
			<LinkEmail email={email} />
		</View>
	)
}

export default CardEma
