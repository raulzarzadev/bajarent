import { useNavigation } from '@react-navigation/native'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import theme from '../theme'
import StoreDetails from './StoreDetails'

const ScreenStoreDetails = () => {
	const { navigate } = useNavigation()
	const { store } = useStore()
	const { user } = useAuth()
	const isOwner = store?.createdBy === user?.id

	return (
		<ScrollView style={{ width: '100%' }}>
			<View style={gStyles.container}>
				{!store && (
					<Text style={[gStyles.h3, { marginVertical: 16 }]}>
						Selecciona o crea una tienda en tu{' '}
						<Pressable
							onPress={() => {
								// @ts-expect-error
								navigate('Profile')
							}}
						>
							<Text
								style={{
									color: theme.secondary
								}}
							>
								Perfil
							</Text>
						</Pressable>
					</Text>
				)}
				{isOwner && (
					<View
						style={{
							borderRadius: 9999,
							marginVertical: 16,
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
				{store && <StoreDetails />}
			</View>
		</ScrollView>
	)
}

export default ScreenStoreDetails
