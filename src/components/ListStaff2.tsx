import { StyleSheet, Text, View } from 'react-native'
import { ListE } from './List'
import { useNavigation } from '@react-navigation/native'
import StaffType from '../types/StaffType'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import ListRow, { ListRowField } from './ListRow'
import InputDisabledStaff from './InputDisabledStaff'

const ListStaff = ({
  staff = [],
  sectionId,
  onPressRow,
  showNewStaff = true,
  handleAdd,
  handleSubtract,
  handleEdit
}: {
  staff: StaffType[]
  sectionId?: string
  onPressRow?: (itemId: string) => void
  showNewStaff?: boolean
  handleAdd?: (rowId: string) => void
  handleSubtract?: (rowId: string) => void
  handleEdit?: (rowId: string) => void
}) => {
  const { navigate } = useNavigation()
  const {
    permissions: { canEditStaff }
  } = useEmployee()

  return (
    <View>
      <ListE
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
        onPressRow={(itemId) => {
          onPressRow?.(itemId)
        }}
        filters={[]}
        sideButtons={[
          {
            icon: 'add',
            onPress: () => {
              //@ts-ignore
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
    permissions: { canEditStaff }
  } = useEmployee()

  const fields: ListRowField[] = [
    { component: <Text>{staff?.name}</Text>, width: 120 },
    {
      component: (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <InputDisabledStaff staffId={staff.id} />

          {handleSubtract && (
            <Button
              size="small"
              icon="sub"
              color="error"
              justIcon
              onPress={() => {
                console.log('delete')
                handleSubtract?.(staff?.id)
              }}
              disabled={!canEditStaff}
            />
          )}
          {handleEdit && (
            <Button
              size="small"
              icon="edit"
              justIcon
              onPress={() => {
                console.log('edit')
                handleEdit?.(staff?.id)
              }}
              disabled={!canEditStaff}
            />
          )}
          {handleAdd && (
            <Button
              size="small"
              icon="add"
              color="info"
              justIcon
              onPress={() => {
                console.log('add')
                handleAdd?.(staff?.id)
              }}
              disabled={!canEditStaff}
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

const styles = StyleSheet.create({})
