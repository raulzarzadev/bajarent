import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceUsers } from '../firebase/ServiceUser'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import { gStyles } from '../styles'
import theme, { colors } from '../theme'
import type StaffType from '../types/StaffType'
import type { CreateStaffType } from '../types/StaffType'
import type UserType from '../types/UserType'
import Button from './Button'
import CardUser from './CardUser'
import FormStaff from './FormStaff'
import InputSearch from './Inputs/InputSearch'
import Loading from './Loading'
import P from './P'

const ScreenStaffNew = ({ route }) => {
	const { shop } = useShop()
	const { goBack } = useNavigation()
	const [user, setUser] = useState<UserType>()
	const defaultValues: Partial<StaffType> = {
		userId: user?.id,
		position: user?.name,
		name: user?.name || ''
	}
	const sectionId = route?.params?.sectionId

	if (!shop) return <Loading />
	if (sectionId) defaultValues.sectionsAssigned = [sectionId]
	return (
		<ScrollView style={{ width: '100%' }}>
			<View style={gStyles.container}>
				{!user && <SearchStaff setUser={setUser} />}
				{!!user && (
					<View>
						<CardUser user={user} />
						<Button
							label="Buscar otro"
							icon="search"
							variant="ghost"
							onPress={() => setUser(null)}
						/>
					</View>
				)}

				{!!user && (
					<FormStaff
						defaultValues={defaultValues}
						onSubmit={async values => {
							const newStaff: CreateStaffType = {
								// name: user.name || '',

								...values,
								position: values.position || '',
								storeId: shop.id,
								userId: user.id || ''
							}
							const [err, res] = await catchError(
								ServiceStores.addStaff({
									storeId: shop.id,
									staff: newStaff
								})
							)
							console.log({ err, res })
							//*TODO:   Remove after migration staff is completely removed from store
							ServiceStaff.addStaffToStore(shop?.id, newStaff).then(() => {
								setUser(undefined)
								goBack()
							})
						}}
					/>
				)}
			</View>
		</ScrollView>
	)
}

const SearchStaff = ({ setUser }: { setUser?: (user: UserType) => any }) => {
	const [text, setText] = useState('')
	const [error, setError] = useState<string | null>('')
	const [loading, setLoading] = useState(false)
	const { shop } = useShop()
	const shopStaff = shop?.staff || []
	const [users, setUsers] = useState([])
	useEffect(() => {
		if (text?.length <= 0) {
			setUsers([])
			setLoading(false)
			setError(null)
			return
		}
	}, [text])

	const alreadyIsStaff = (userId: string) => {
		return shopStaff.some(s => s.userId === userId)
	}

	return (
		<View style={{ width: '100%', marginHorizontal: 'auto' }}>
			<Text>Buscar usuario</Text>
			<InputSearch
				onChange={text => {
					setText(text)
				}}
				placeholder="Buscar usuario por telefono, nombre o email"
				helperText="*El usuario debe estar registrado en la plataforma"
			/>
			<Button
				label="Buscar"
				icon="search"
				onPress={async () => {
					setLoading(true)
					setError(null)
					const [err, res] = await catchError(ServiceUsers.searchUser(text))
					if (err) {
						setError('Usuario no encontrado, asegurate que esta registrado sus datos son correctos')
						setUsers([])
					} else {
						if (!res.length) {
							setError(
								'Usuario no encontrado, asegurate que esta registrado sus datos son correctos'
							)
							setUsers([])
						} else {
							setUsers(res)
							setError(null)
						}
					}
					setLoading(false)
				}}
				buttonStyles={{
					marginVertical: 10,
					width: 140,
					marginHorizontal: 'auto'
				}}
			/>
			{!!error && <P styles={{ color: theme.error }}>{error}</P>}

			<View style={{ padding: 4, justifyContent: 'center' }}>
				{!!loading && <ActivityIndicator />}
				{users.map(user => {
					const isStaff = alreadyIsStaff(user.id)
					return (
						<Pressable
							disabled={isStaff}
							onPress={() => {
								setUser(user)
								setUsers([])
								setText('')
							}}
							key={user.id}
							style={{
								padding: 8,
								borderRadius: 20,
								backgroundColor: isStaff ? colors.gray : theme.primary,
								flexDirection: 'row',
								justifyContent: 'space-evenly',
								opacity: isStaff ? 0.5 : 1
							}}
						>
							<Text>{user.name}</Text>
							<Text>{user.phone}</Text>
							<Text>{user.email}</Text>
							{isStaff && <Text>'Ya es parte de este equipo'</Text>}
						</Pressable>
					)
				})}
			</View>
		</View>
	)
}

export default ScreenStaffNew
