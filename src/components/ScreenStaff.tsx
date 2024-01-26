import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { useEffect } from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import theme from '../theme'
import { ServiceUsers } from '../firebase/ServiceUser'

const ScreenStaff = ({ navigation }) => {
  const { staff } = useStore()
  if (!staff) return <ActivityIndicator />
  return (
    <ScrollView style={{ padding: 6 }}>
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
            staff={item}
            onPress={() =>
              navigation.navigate('StaffDetails', { staffId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  )
}

export const StaffRow = ({ staff, onPress }) => {
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
        <Text>{staff?.position}</Text>
        <Text>{staff?.name}</Text>
        <Text>{staff?.phone}</Text>
        <Text>{staff?.email}</Text>
      </View>
      <View></View>
      {/* <ButtonIcon
        icon="edit"
        variant="ghost"
        onPress={() => {
          navigate('StaffEdit', { staffId: staff.id })
        }}
      ></ButtonIcon> */}
    </Pressable>
  )
}

export default ScreenStaff

const styles = StyleSheet.create({})
