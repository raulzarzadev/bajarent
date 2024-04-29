import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import List from './List'
import { useNavigation } from '@react-navigation/native'
import StaffType from '../types/StaffType'
import Button from './Button'

const ListStaff = ({
  staff,
  sectionId
}: {
  staff: StaffType[]
  sectionId?: string
}) => {
  console.log({ staff })
  const { navigate } = useNavigation()
  return (
    <View>
      <List
        ComponentRow={({ item }) => <StaffRow staff={item} />}
        data={staff}
        filters={[]}
        sideButtons={[
          {
            icon: 'add',
            onPress: () => navigate('ScreenStaffNew', { sectionId }),
            label: 'Add',
            visible: true
          }
        ]}
      />
    </View>
  )
}

const StaffRow = ({ staff }: { staff: Partial<StaffType> }) => {
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
      <View>
        <Button
          size="small"
          icon="sub"
          color="error"
          justIcon
          onPress={() => console.log('delete')}
        />
      </View>
      <View>
        <Button
          size="small"
          icon="edit"
          justIcon
          onPress={() => console.log('edit')}
        />
      </View>
    </View>
  )
}

export default ListStaff

const styles = StyleSheet.create({})
