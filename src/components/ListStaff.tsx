import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  ViewStyle
} from 'react-native'
import React from 'react'
import theme from '../theme'
import StaffType from '../types/StaffType'
import { dateFormat } from '../libs/utils-date'
import ButtonConfirm from './ButtonConfirm'
import { gStyles } from '../styles'

const ListStaff = ({
  staffSelected = [],
  onPress,
  staff = []
}: {
  staffSelected?: string[]
  onPress: (staffId: string) => void
  staff: StaffType[]
}) => {
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
          <StaffRow
            style={{
              borderColor: staffSelected?.includes(item?.id)
                ? theme.secondary
                : 'transparent',
              borderWidth: 2
            }}
            key={item?.id}
            staff={item}
            fields={['name', 'position']}
            onPress={
              () => onPress(item?.id)
              // navigation.navigate('StaffDetails', { staffId: item.id })
            }
          />
        )}
      />
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
  if (!staff) return null // <MissStaff />
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
          backgroundColor: theme.info,
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
            {text(staff?.[field] as string)}
          </Text>
        ))}
      </View>
    </Pressable>
  )
}

const MissStaff = () => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 5,
          backgroundColor: theme.info,
          padding: 8,
          borderRadius: 6
        }
      ]}
    >
      <Text style={gStyles.helper}>
        Staff no encontrado. Probablemente fue eliminado de la empresa
      </Text>
      <ButtonConfirm
        text="Eliminar"
        justIcon
        icon="delete"
        openColor="error"
        confirmColor="error"
        openVariant="ghost"
        handleConfirm={async () => {
          console.log('Eliminar')
        }}
        confirmLabel="Eliminar"
        modalTitle="Eliminar Staff no encontrado"
      ></ButtonConfirm>
    </View>
  )
}

export default ListStaff
