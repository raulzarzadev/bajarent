import { StyleSheet, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { gSpace } from '../styles'
import BadgeAdmin from './BadgeAdmin'
import BadgeOwner from './BadgeOwner'

const BadgesStore = () => {
	const {
		permissions: { isAdmin, isOwner }
	} = useEmployee()
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				maxWidth: 500,
				width: '100%',
				margin: 'auto'
			}}
		>
			{isOwner && (
				<View style={{ margin: gSpace(1) }}>
					<BadgeOwner isOwner={isOwner} />
				</View>
			)}
			{isAdmin && (
				<View style={{ margin: gSpace(1) }}>
					<BadgeAdmin isAdmin={isAdmin} />
				</View>
			)}
		</View>
	)
}

export default BadgesStore

const styles = StyleSheet.create({})
