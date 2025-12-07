import { Text } from 'react-native'
import { useStore } from '../contexts/storeContext'
import StoreType from '../types/StoreType'

const SpanUser = ({ userId }) => {
	const { staff } = useStore()
	const userName = getUserName(staff, userId)
	return (
		<Text style={{ fontWeight: 'bold' }} numberOfLines={1}>
			{userName}
		</Text>
	)
}

export const getUserName = (staff: StoreType['staff'], userId: string) =>
	staff?.find(s => s.userId === userId)?.name ||
	staff?.find(s => s.userId === userId)?.name ||
	staff?.find(s => s.id === userId)?.name

export default SpanUser
