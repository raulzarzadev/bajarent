import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { onUpdateItem } from '../firebase/actions/item-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { gStyles } from '../styles'
import type ItemType from '../types/ItemType'
import ErrorBoundary from './ErrorBoundary'
import FormItem from './FormItem'
import Loading from './Loading'

const ScreenItemEdit = ({ route }) => {
	const itemId = route?.params?.id
	const { goBack } = useNavigation()
	const { storeId } = useStore()
	const [item, setItem] = useState<Partial<ItemType>>()
	useEffect(() => {
		ServiceStoreItems.get({ storeId, itemId }).then(res => {
			setItem(res)
		})
	}, [itemId])

	const handleUpdateItem = async (values: ItemType) => {
		return await onUpdateItem({ storeId, itemId, values })
			.then(res => {
				console.log({ res })
			})
			.catch(e => {
				console.log({ e })
			})
	}
	if (item === undefined) return <Loading />

	if (item === null) return <Text>Item not found</Text>
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormItem
					values={item}
					onSubmit={async values => {
						await handleUpdateItem(values)
						goBack()
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default ScreenItemEdit

export const ScreenItemEditE = props => (
	<ErrorBoundary componentName="ScreenItemEdit">
		<ScreenItemEdit {...props} />
	</ErrorBoundary>
)

const styles = StyleSheet.create({})
