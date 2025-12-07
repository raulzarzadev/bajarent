import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import type StaffType from '../types/StaffType'
import Button from './Button'
import InputDisabledStaff from './InputDisabledStaff'
import { ListE } from './List'
import ListRow, { type ListRowField } from './ListRow'

const ListStaff = ({
	staff = [],
	sectionId,
	onPressRow,
	showNewStaff = true,
	handleAdd,
	handleSubtract,
	handleEdit,
	hideSearchAndFilters = false
}: {
	staff: StaffType[]
	sectionId?: string
	onPressRow?: (itemId: string) => void
	showNewStaff?: boolean
	handleAdd?: (rowId: string) => void
	handleSubtract?: (rowId: string) => void
	handleEdit?: (rowId: string) => void
	hideSearchAndFilters?: boolean
}) => {
	const { navigate } = useNavigation()
	const {
		permissions: { canEditStaff, isAdmin }
	} = useEmployee()
	const disableAdd = !canEditStaff

	return (
		<View>
			<ListE
				hideSearchAndFilters={hideSearchAndFilters}
				id="list-staff"
				sortFields={[
					{ key: 'name', label: 'Nombre' },
					{ key: 'disabled', label: 'Habilitado' }
				]}
				ComponentRow={({ item }) => (
					<StaffRow
						staff={item}
						handleAdd={handleAdd}
						handleSubtract={handleSubtract}
						handleEdit={handleEdit}
					/>
				)}
				data={staff}
				onPressRow={itemId => {
					onPressRow?.(itemId)
				}}
				filters={[]}
				sideButtons={[
					{
						icon: 'add',
						onPress: () => {
							//@ts-expect-error
							navigate('StackStaff', {
								screen: 'ScreenStaffNew',
								params: { sectionId }
							})
						},
						label: 'Add',
						visible: showNewStaff ? true : false,
						disabled: disableAdd
					}
				]}
			/>
		</View>
	)
}

const StaffRow = ({
	staff,
	handleAdd,
	handleSubtract,
	handleEdit
}: {
	staff: Partial<StaffType>
	handleAdd?: (rowId: string) => void
	handleSubtract?: (rowId: string) => void
	handleEdit?: (rowId: string) => void
}) => {
	const {
		permissions: { canEditStaff, isAdmin, isOwner }
	} = useEmployee()

	const disabled = canEditStaff === false && isAdmin === false && isOwner === false

	const fields: ListRowField[] = [
		{ component: <Text>{staff?.name}</Text>, width: 120 },
		{
			component: (
				<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<InputDisabledStaff staffId={staff?.id} />

					{handleSubtract && (
						<Button
							size="small"
							icon="sub"
							color="error"
							justIcon
							onPress={() => {
								handleSubtract?.(staff?.id)
							}}
							disabled={disabled}
						/>
					)}
					{handleEdit && (
						<Button
							size="small"
							icon="edit"
							justIcon
							onPress={() => {
								handleEdit?.(staff?.id)
							}}
							disabled={disabled}
						/>
					)}
					{handleAdd && (
						<Button
							size="small"
							icon="add"
							color="info"
							justIcon
							onPress={() => {
								handleAdd?.(staff?.id)
							}}
							disabled={disabled}
						/>
					)}
				</View>
			),
			width: 'rest'
		}
	]
	return <ListRow fields={fields} style={{ marginVertical: 2 }} />
}

export default ListStaff
