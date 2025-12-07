import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import theme from '../theme'
import { gStyles } from '../styles'
import Icon, { IconName } from './Icon'
import { useNavigation } from '@react-navigation/native'
import StoreType from '../types/StoreType'
import { useAuth } from '../contexts/authContext'
import Button from './Button'
import { reloadApp } from '../libs/reloadApp'

const ChooseProfile = () => {
	const { navigate } = useNavigation()
	const {
		stores: userStores = [],
		storeId: storeSelected,
		user,
		handleSetStoreId,
		clearStoreSelection
	} = useAuth()
	const sortUserStore = (userStores, storeSelected) => {
		let res = []
		const selectedStore = userStores?.find(store => store?.id === storeSelected)
		const otherStores = userStores?.filter(store => store?.id !== storeSelected)
		if (selectedStore) {
			res.push(selectedStore)
		}
		res = res.concat(otherStores)
		return res
	}

	const [userStoresSorted, setUserStoresSorted] = React.useState<Partial<StoreType>[]>(userStores)

	useEffect(() => {
		const sortedUserStores = sortUserStore(userStores, storeSelected)
		setUserStoresSorted(sortedUserStores)
	}, [userStores, storeSelected])

	const [stores, setStores] = useState(userStoresSorted)

	const [storeSelectedId, setStoreSelectedId] = useState<string>()
	const handleSelectStore = async id => {
		if (id === 'createStore') {
			// @ts-ignore
			navigate('CreateStore')
			return
		}
		if (storeSelected === id) {
			return
		}
		setStoreSelectedId(id) //* <-- component state
		await handleSetStoreId(id) //* <-- context state
		await reloadApp()
	}
	useEffect(() => {
		setStoreSelectedId(storeSelected)
	}, [storeSelected])

	useEffect(() => {
		const showStores = [...userStoresSorted]
		if (user.canCreateStore) {
			showStores.push({ id: 'createStore', name: 'Crear tienda' })
		}
		setStores(showStores)
	}, [user.canCreateStore, userStoresSorted])

	return (
		<View style={{}}>
			<Text
				style={{
					width: '100%',
					maxWidth: 500,
					margin: 'auto',
					textAlign: 'left'
				}}
			>
				Selecciona una tienda
			</Text>
			<FlatList
				style={{
					maxWidth: '100%',
					marginHorizontal: 'auto',
					// maxWidth: 500,
					// margin: 'auto',
					paddingHorizontal: 16,
					paddingVertical: 12
				}}
				ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
				horizontal
				data={stores}
				renderItem={({ item: store }) => (
					<SquareStore
						selected={storeSelectedId === store.id}
						store={store}
						onClickStore={handleSelectStore}
						icon={store.id === 'createStore' ? 'add' : undefined}
					/>
				)}
			/>
			{!!storeSelected && (
				<View style={{ marginTop: 12 }}>
					<Button
						variant="ghost"
						label="Cambiar de tienda"
						onPress={() => clearStoreSelection?.()}
					/>
				</View>
			)}
		</View>
	)
}

const SquareStore = ({
	store,
	onClickStore,
	selected,
	icon
}: {
	store: Partial<StoreType>
	selected?: boolean
	onClickStore: (id: string) => void
	icon?: IconName
}) => {
	return (
		<Pressable
			role="button"
			is-selected={selected}
			onPress={() => {
				onClickStore(store?.id)
			}}
			style={[
				styles.store,
				{
					backgroundColor: selected ? theme.info : theme.white
				}
			]}
		>
			<Text numberOfLines={2} style={[gStyles.h3, { color: selected ? theme.white : theme.black }]}>
				{store.name}
			</Text>
			<View style={{ justifyContent: 'center', margin: 'auto' }}>
				{icon && <Icon icon={icon} />}
			</View>
		</Pressable>
	)
}

export default ChooseProfile
const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	store: {
		borderWidth: 2,
		borderColor: 'transparent',
		width: 120,
		height: 70,
		aspectRatio: 4 / 2,
		padding: 8,
		borderRadius: 8,
		shadowColor: theme.black,
		shadowOffset: {
			width: 2,
			height: 2
		},
		shadowOpacity: 0.1,
		shadowRadius: 4
	}
})
