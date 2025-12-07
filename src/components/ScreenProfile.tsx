import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { logout } from '../firebase/auth'
import { AppVersionE } from './AppVersion'
import Button from './Button'
import { CardEmployeeE } from './CardEmployee'
import CardUser from './CardUser'
import ChooseProfile from './ChooseProfile'
import ErrorBoundary from './ErrorBoundary'
import PhoneLogin from './LoginPhone'
import LoginSignUpEmail from './LoginSignupEmail'

const ScreenProfile = ({ navigation }) => {
	const { user } = useAuth()
	if (user === undefined) return <ActivityIndicator />
	if (user === null)
		return (
			<ErrorBoundary componentName="FormLogin">
				<ScrollView>
					<PhoneLogin />
					{!!__DEV__ && <LoginSignUpEmail />}
				</ScrollView>
			</ErrorBoundary>
		)

	return (
		<ScrollView style={{ padding: 2 }}>
			<AppVersionE />
			<ErrorBoundary componentName="CardUser">
				<CardUser
					user={user}
					onEdit={() => {
						navigation.navigate('EditProfile')
					}}
				/>
			</ErrorBoundary>
			<ErrorBoundary componentName="ChooseProfile">
				<ChooseProfile />
			</ErrorBoundary>
			<ErrorBoundary componentName="CardStaff">
				<CardEmployeeE />
			</ErrorBoundary>

			<View style={styles.buttons}>
				<Button
					onPress={() => {
						logout()
					}}
					variant="outline"
					color="error"
					label="Cerrar sesión"
				></Button>
			</View>
		</ScrollView>
	)
}

export default function (props) {
	return (
		<ErrorBoundary componentName="ScreenProfile" {...props}>
			<ScreenProfile {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	store: {
		marginVertical: 6
	},
	buttons: { justifyContent: 'center', alignItems: 'center', marginVertical: 6 }
})
