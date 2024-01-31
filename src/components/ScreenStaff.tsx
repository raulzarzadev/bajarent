import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import StaffType from '../types/StaffType'
import { dateFormat } from '../libs/utils-date'

const ScreenStaff = ({ navigation }) => {
  const { staff } = useStore()
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
      <Button
        onPress={() => {
          navigation.navigate('StaffNew')
        }}
        buttonStyles={{
          width: 140,
          margin: 'auto',
          marginVertical: 10
        }}
      >
        Agregar
      </Button>
      <FlatList
        data={staff || []}
        renderItem={({ item }) => (
          <StaffRow
            key={item.id}
            staff={item}
            fields={['name', 'position']}
            onPress={() =>
              navigation.navigate('StaffDetails', { staffId: item.id })
            }
          />
        )}
        // keyExtractor={(item) => item.id}
      />
    </ScrollView>
  )
}

export const StaffRow = ({
  staff,
  onPress,
  fields = ['name', 'position']
}: {
  staff: StaffType
  onPress: () => void
  fields?: (keyof StaffType)[]
}) => {
  const text = (field?: string | Date): string => {
    if (typeof field === 'string') return field
    if (field instanceof Date) {
      return dateFormat(field)
    }
  }
  return (
    <Pressable
      onPress={() => {
        onPress()
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: theme.primary,
        padding: 8,
        borderRadius: 6
      }}
    >
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}
      >
        {fields?.map((field) => (
          <Text
            key={field}
            style={{ marginHorizontal: 4, width: `${100 / fields.length}%` }}
            numberOfLines={1}
          >
            {text(staff[field] as string)}
          </Text>
        ))}
      </View>
    </Pressable>
  )
}

export default ScreenStaff
