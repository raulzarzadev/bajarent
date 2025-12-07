import { Text, View } from 'react-native'
import CardPhone, { CardPhoneE } from './CardPhone'
import CardEmail from './CardEmail'
import UserType from '../types/UserType'
import { gStyles } from '../styles'
import Button from './Button'
import Chip from './Chip'
import { colors } from '../theme'
import { useAuth } from '../contexts/authContext'

const CardUser = ({ user, onEdit }: { user?: UserType; onEdit?: () => void }) => {
	const _user = user
	const { user: currentUser } = useAuth()
	const itsMyUser = currentUser.id === user?.id
	if (!user) return <Text>No user found</Text>
	return (
		<View style={{ justifyContent: 'center' }}>
			{/* <Text style={gStyles.h1}>usuario</Text> */}
			{itsMyUser && (
				<Chip
					title={'yo'}
					color={colors.indigo}
					size="sm"
					style={{ maxWidth: 80, margin: 'auto' }}
				/>
			)}
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Text style={[gStyles.h2, { marginRight: 4 }]}>{_user?.name}</Text>
				{onEdit && (
					<Button
						icon="edit"
						justIcon
						onPress={() => {
							//@ts-ignore
							//navigate('EditProfile')
							onEdit?.()
						}}
						size="small"
						variant="ghost"
						//label="Editar información"
					></Button>
				)}
			</View>

			<CardPhoneE
				phone={_user?.phone}
				style={{
					marginHorizontal: 'auto'
				}}
			/>
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
