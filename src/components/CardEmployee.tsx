import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { useShop } from '../hooks/useShop'
import type { RootTabParamList } from '../navigation/types'
import { gStyles } from '../styles'
import theme from '../theme'
import { staff_roles } from '../types/StaffType'
import { BadgeListSectionsE } from './BadgeListSections'
import BadgesStore from './BadgesStore'
import Button from './Button'
import Chip from './Chip'
import { EmployeeDetailsE } from './EmployeeDetails'
import ErrorBoundary from './ErrorBoundary'

const CardEmployee = () => {
	const { shop } = useShop()
	const { employee } = useEmployee()
	// const { navigate } = useNavigation<NavigationProp<RootTabParamList>>()
	// const staffRoles = Object.entries(employee?.roles || {}).reduce(
	//   (acc, [key, value]) => {
	//     if (value) {
	//       acc.push(key)
	//     }
	//     return acc
	//   },
	//   []
	// )

	return <EmployeeDetailsE employee={employee} shop={shop} />
}

export const EmployeeSections = ({
	onPressSection,
	selectedSection
}: {
	onPressSection?: ({ sectionId }: { sectionId: string }) => void
	selectedSection?: string | null
}) => {
	const { employee } = useEmployee()
	const { sections } = useStore()
	return (
		<>
			<Text style={[gStyles.helper, gStyles.tCenter]}>Areas asignadas:</Text>
			{!employee?.sectionsAssigned?.length && (
				<Text style={[gStyles.p, gStyles.tCenter]}>No estas asignado a ni un area</Text>
			)}

			<BadgeListSectionsE
				sections={sections?.filter(section => employee?.sectionsAssigned?.includes(section.id))}
				selectedSection={selectedSection}
				onPressSection={onPressSection}
			/>
		</>
	)
}
export const CardEmployeeE = props => {
	return (
		<ErrorBoundary componentName="CardEmployee">
			<CardEmployee {...props} />
		</ErrorBoundary>
	)
}

export default CardEmployee
