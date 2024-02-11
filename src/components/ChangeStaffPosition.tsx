import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gStyles } from '../styles'

const ChangeStaffPosition = () => {
  const { userPositions, myStaffId, handleSetMyStaffId, handleSetStoreId } =
    useStore()
  return (
    <View style={{ margin: 'auto' }}>
      <FlatList
        horizontal
        data={userPositions}
        renderItem={({ item: position }) => (
          <Pressable
            key={position?.id}
            onPress={() => {
              handleSetStoreId(position?.storeId)
              handleSetMyStaffId(position?.id)
            }}
            style={[
              styles.store,
              {
                borderColor:
                  myStaffId === position?.id ? theme.secondary : theme.white,
                backgroundColor:
                  myStaffId === position?.id ? theme.primary : theme.white
              }
            ]}
          >
            <Text style={[gStyles.h3]}>{position?.position}</Text>
            <Text style={[gStyles.p, gStyles.tCenter]}>
              {position?.store?.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

export default ChangeStaffPosition
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  store: {
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 120,
    margin: 8,
    aspectRatio: 4 / 2,
    padding: 8,
    borderRadius: 8
  }
})
