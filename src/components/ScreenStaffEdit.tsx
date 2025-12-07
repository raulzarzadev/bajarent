import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { FormStaffE } from './FormStaff'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import CardUser from './CardUser'
import { gStyles } from '../styles'
import UserType from '../types/UserType'
import { ServiceStores } from '../firebase/ServiceStore'
import { useShop } from '../hooks/useShop'
import { useAuth } from '../contexts/authContext'
import catchError from '../libs/catchError'

const ScreenStaffEdit = ({ route }) => {
	const { storeId } = useAuth()
	const { shop } = useShop()
	const shopStaff = shop?.staff || []
	const { staff } = useStore() // <--Buscar staff
	if (!staff?.length) return <ActivityIndicator />

	const staffId = route.params.staffId
	const employee = shopStaff?.find(({ id }) => id === staffId)
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<CardUser user={employee as UserType} />

				<FormStaffE
					defaultValues={employee}
					onSubmit={async values => {
						const [err, res] = await catchError(
							ServiceStores.updateStaff({
								staffId,
								storeId,
								staff: {
									...values
								}
							})
						)
						console.log({ err, res })
						//*TODO:   Remove after migration staff is completely removed from store
						ServiceStaff.update(staffId, values)
							.then(res => {
								//console.log(res)
							})
							.catch(console.error)
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default ScreenStaffEdit

const styles = StyleSheet.create({})
