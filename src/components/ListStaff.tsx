import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView
} from 'react-native'
import React from 'react'
import StaffType from '../types/StaffType'
import ErrorBoundary from './ErrorBoundary'
import StaffRow from './StaffRow'

export type ListStaffProps = {
  staffSelected?: string[]
  onPress?: (staffId: string) => void
  staff?: (StaffType | { id: string; missing: boolean })[]
  sectionId?: string
  hideActions?: boolean
}
const ListStaff = ({
  staffSelected = [],
  onPress,
  staff = [],
  sectionId = '',
  hideActions
}: ListStaffProps) => {
  if (!staff) return <ActivityIndicator />
  return (
    <ScrollView
      style={{
        padding: 6,
        maxWidth: 400,
        width: '100%',
        marginHorizontal: 'auto'
      }}
    >
      <FlatList
        data={staff || []}
        renderItem={({ item }) => (
          <ErrorBoundary key={item?.id} componentName={`StaffRow ${item?.id}`}>
            <Pressable onPress={() => onPress(item?.id)}>
              <StaffRow
                selected={staffSelected.includes(item?.id)}
                sectionId={sectionId}
                staffId={item?.id}
                fields={['name', 'position']}
                hideActions={hideActions}
              />
            </Pressable>
          </ErrorBoundary>
        )}
      />
    </ScrollView>
  )
}

export default (props: ListStaffProps) => {
  return (
    <ErrorBoundary componentName="ListStaff">
      <ListStaff {...props} />
    </ErrorBoundary>
  )
}
