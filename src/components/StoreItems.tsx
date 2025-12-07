import { View } from 'react-native'
import ListStoreItems from './ListStoreItems'

const StoreItems = () => {
	return (
		<View style={{ marginTop: 16 }}>
			<ListStoreItems allItems />
		</View>
	)
}

export default StoreItems
