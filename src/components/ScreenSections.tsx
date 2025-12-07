import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { gSpace, gStyles } from '../styles'
import theme from '../theme'
import Button from './Button'
import Loading from './Loading'
import StaffRow from './StaffRow'

const ScreenSections = ({ navigation }) => {
	const { sections: storeSections, store } = useStore()
	const {
		permissions: { canEditStaff }
	} = useEmployee()
	const handlePressRow = sectionId => {
		navigation.navigate('ScreenSectionsDetails', { sectionId })
	}
	const createSection = !!canEditStaff
	if (!store) return <Loading />
	return (
		<ScrollView style={{ width: '100%' }}>
			<View style={gStyles.container}>
				<View
					style={{
						alignItems: 'center',
						flexDirection: 'row',
						justifyContent: 'center'
					}}
				>
					<Text>Areas {storeSections?.length || 0} </Text>
					<View>
						<Button
							buttonStyles={{
								margin: 'auto',
								marginVertical: 16
							}}
							onPress={() => {
								navigation.navigate('ScreenSectionsNew')
							}}
							icon="add"
							justIcon
							size="small"
							disabled={!createSection}
						></Button>
					</View>
				</View>
				<View>
					<FlatList
						data={storeSections}
						ListHeaderComponent={() => (
							<Row onPress={() => null} labels={['Area', 'Staff', 'Ordenes', 'Reportes']} />
						)}
						renderItem={({ item }) => (
							<Row
								onPress={() => {
									handlePressRow(item.id)
								}}
								labels={[item?.name, item?.staff?.length, '-', '-']}
							/>
						)}
					></FlatList>
				</View>
			</View>
		</ScrollView>
	)
}
const Row = ({ labels = [], onPress }) => {
	const cellWidth = 100 / labels.length
	return (
		<Pressable style={{ flexDirection: 'row', marginVertical: 6 }} onPress={onPress}>
			{labels.map((label, i) => (
				<View key={`${label}-${i}`} style={{ width: `${cellWidth}%` }}>
					<Text style={{ textAlign: 'center' }}>{label}</Text>
				</View>
			))}
		</Pressable>
	)
}
export const SectionRow = ({
	section,
	onPress
}: {
	section
	onPress: (sectionId: string) => void
}) => {
	return (
		<View
			// onPress={() => {
			//   onPress(section.id)
			// }}
			style={styles.item}
		>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={{ width: '100%' }}>{section?.name}</Text>
				<Button
					icon="verticalDots"
					justIcon
					label="Ver"
					onPress={() => onPress(section.id)}
				></Button>
			</View>
			<Text>{section?.description}</Text>
			<View style={styles.staff}>
				<Text style={[gStyles.h3, { textAlign: 'center' }]}>Staff: </Text>
				<Text style={{ textAlign: 'center' }}>({section?.staff?.length || 0})</Text>
				{section?.staff?.map(staffId => (
					<StaffRow key={staffId} staffId={staffId} sectionId={section.id} />
				))}
			</View>
		</View>
	)
}

export default ScreenSections

const styles = StyleSheet.create({
	item: {
		padding: gSpace(3),
		backgroundColor: theme.info,
		marginVertical: gSpace(2),
		borderRadius: gSpace(2)
	},
	staff: {
		maxWidth: 350,
		width: '100%',
		margin: 'auto'
	}
})
