import { ActivityIndicator, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ServiceUsers } from '../firebase/ServiceUser'
import CardPhone from './CardPhone'
import CardEmail from './CardEmail'
import UserType from '../types/UserType'
import { gStyles } from '../styles'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'

export const StaffName = ({ userId }: { userId: string }) => {
	const { staff } = useStore()
	const staffName = staff?.find(s => s.userId === userId)?.name
	return <Text>{staffName}</Text>
}
const CardUser = ({ userId, user }: { userId?: string; user?: UserType }) => {
	const { navigate } = useNavigation()
	const [_user, _setUser] = useState(user)

	useEffect(() => {
		_setUser(user)
		if (userId && !user)
			ServiceUsers.get(userId).then(res => {
				_setUser(res)
			})
	}, [user, userId])

	const itsMyUser = userId === user?.id

	if (!_user) return <ActivityIndicator />

	return (
		<View style={{ justifyContent: 'center' }}>
			{/* <Text style={gStyles.h1}>usuario</Text> */}
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Text style={[gStyles.h2, { marginRight: 4 }]}>{_user?.name} </Text>
				<Button
					icon="edit"
					justIcon
					onPress={() => {
						//@ts-ignore
						navigate('EditProfile')
					}}
					size="small"
					variant="ghost"
					//label="Editar información"
				></Button>
			</View>
			<CardPhone phone={_user?.phone} />
			<CardEmail email={_user?.email} />
			{__DEV__ && (
				<Text style={[{ textAlign: 'center', marginHorizontal: 'auto' }, gStyles.helper]}>
					Id : {_user.id}
				</Text>
			)}
		</View>
	)
}

export default CardUser
