import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import { gStyles } from '../styles'
import { EmployeeDetailsE } from './EmployeeDetails'
import { FormStaffE } from './FormStaff'

const ScreenStaffEdit = ({ route }) => {
	const { storeId } = useAuth()
	const { shop } = useShop()
	const { permissions } = useEmployee()
	const canEditStaff = permissions.canEditStaff || false
	const shopStaff = shop?.staff || []
	const { staff } = useStore() // <--Buscar staff
	if (!staff?.length) return <ActivityIndicator />

	const staffId = route.params.staffId
	const employee = shopStaff?.find(({ id }) => id === staffId)

	return (
		<ScrollView>
			<View style={gStyles.container}>
				<EmployeeDetailsE employee={employee} shop={shop} />
				{!canEditStaff && (
					<Text style={gStyles.tCenter}>No tienes permisos para editar el personal.</Text>
				)}
				{canEditStaff && (
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
						}}
					/>
				)}
			</View>
		</ScrollView>
	)
}

export default ScreenStaffEdit
