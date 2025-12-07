import { useNavigation } from '@react-navigation/native'

import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { onCreateItem } from '../firebase/actions/item-actions'
import { gStyles } from '../styles'
import type ItemType from '../types/ItemType'
import FormItem from './FormItem'

const ScreenItemNew = () => {
	const { goBack } = useNavigation()
	const { storeId } = useStore()
	const handleCreateItem = async (values: ItemType) => {
		return await onCreateItem({ storeId, item: values })
			.then(res => {
				goBack()
			})
			.catch(err => {
				console.log({ err })
			})
	}

	return (
		<View style={gStyles.container}>
			<FormItem
				onSubmit={async values => {
					return await handleCreateItem(values)
				}}
			/>
		</View>
	)
}

export default ScreenItemNew
