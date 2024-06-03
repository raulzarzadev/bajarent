import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import List, { LoadingList } from './List'
import { useNavigation } from '@react-navigation/native'
import StaffType from '../types/StaffType'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'

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

  const disableAdd = !canEditStaff
  return (
    <View>
      <LoadingList
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
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8
      }}
    >
      <Text>{staff?.name}</Text>
      <Text>{staff?.position}</Text>
      {handleAdd && (
        <View>
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
        </View>
      )}
      {handleEdit && (
        <View>
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
        </View>
      )}
      {handleSubtract && (
        <View>
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
        </View>
      )}
    </View>
  )
}

export default ListStaff

const styles = StyleSheet.create({})
