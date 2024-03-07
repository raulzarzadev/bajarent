import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gStyles } from '../styles'

const ChangeStaffPosition = () => {
  const { userPositions, myStaffId, handleSetMyStaffId, handleSetStoreId } =
    useStore()

  console.log({ myStaffId })

  return (
    <View style={{ margin: 'auto', maxWidth: 500, width: '100%' }}>
      {!userPositions && (
        <View
          style={{
            margin: 'auto',
            width: '100%',
            height: 72,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: theme.primary,
            // borderRadius: 8
          }}
        >
          <Text>Buscando posiciones</Text>
        </View>
      )}
      {Array.isArray(userPositions) && !userPositions?.length && (
        <View
          style={{
            margin: 'auto',
            width: '100%',
            height: 72,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: theme.primary,
            // borderRadius: 8
          }}
        >
          <Text>Sin posiciones</Text>
        </View>
      )}
      {userPositions?.length && (
        <FlatList
          horizontal
          data={userPositions}
          renderItem={({ item: position }) =>
            position ? (
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
                      myStaffId === position?.id
                        ? theme.secondary
                        : theme.white,
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
            ) : (
              <>{/* Return empty if store do not exist any more!  */}</>
            )
          }
        />
      )}
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
    // height: 80,
    margin: 8,
    aspectRatio: 4 / 2,
    padding: 8,
    borderRadius: 8
  }
})
