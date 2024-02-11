import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  ViewStyle
} from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import StaffType from '../types/StaffType'
import { dateFormat } from '../libs/utils-date'
import ListStaff from './ListStaff'
import { gStyles } from '../styles'

const ScreenStaff = ({ navigation }) => {
  const { staff } = useStore()
  if (!staff) return <ActivityIndicator />
  return (
    <ScrollView
      style={{
        width: '100%'
      }}
    >
      <View style={gStyles.container}>
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
        <ListStaff
          onPress={(staffId) => {
            navigation.navigate('StaffDetails', { staffId })
          }}
          staff={staff}
        />
      </View>
    </ScrollView>
  )
}

export const StaffRow = ({
  staff,
  onPress,
  fields = ['name', 'position'],
  style
}: {
  staff: StaffType
  onPress: () => void
  fields?: (keyof StaffType)[]
  style?: ViewStyle
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
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 5,
          backgroundColor: theme.primary,
          padding: 8,
          borderRadius: 6
        },
        style
      ]}
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
