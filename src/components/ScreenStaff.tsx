import { ScrollView, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useShop } from '../hooks/useShop'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ListStaff from './ListStaff2'
import Loading from './Loading'
import TabStoreSections from './TabStoreSections'

const ScreenStaff = () => {
	const { shop } = useShop()
	const shopStaff = shop?.staff || []
	const {
		permissions: { isAdmin, isOwner, store: storePermissions }
	} = useEmployee()

	const canViewSections = isAdmin || isOwner || storePermissions.canEditStaff

	if (!shop) return <Loading id="ScreenStaff" />

	return (
		<ScrollView
			style={{
				width: '100%'
			}}
		>
			<View
				style={{
					padding: 16
				}}
			>
				<Text style={gStyles.h2}>Lista de empleados</Text>
				<ListStaff shop={shop} staff={shopStaff} />
				{canViewSections && (
					<View style={{ marginTop: 16 }}>
						<Text style={gStyles.h2}>Empleados por area</Text>
						<TabStoreSections />
					</View>
				)}
			</View>
		</ScrollView>
	)
}

export const ScreenStaffE = () => (
	<ErrorBoundary componentName="ScreenStaff">
		<ScreenStaff />
	</ErrorBoundary>
)

export default ScreenStaff
