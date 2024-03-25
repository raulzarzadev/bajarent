import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gStyles } from '../styles'
import StaffType from '../types/StaffType'
import { useAuth } from '../contexts/authContext'

const ChooseProfile = () => {
  const {
    userStores,
    userPositions,
    storeId: storeSelected,
    myStaffId
  } = useStore()

  const [storePositions, setStorePositions] = React.useState<
    Partial<StaffType>[]
  >([])

  useEffect(() => {
    const storePositions = userPositions?.filter((position) => {
      return position?.storeId === storeSelected
    })
    setStorePositions(storePositions)
  }, [storeSelected, userStores, userPositions])

  const sortUserStore = (userStores, storeSelected) => {
    const selectedStore = userStores?.find(
      (store) => store?.id === storeSelected
    )
    const otherStores = userStores?.filter(
      (store) => store?.id !== storeSelected
    )
    return [selectedStore, ...otherStores]
  }

  const [userStoresSorted, setUserStoresSorted] = React.useState(userStores)

  useEffect(() => {
    const sortedUserStores = sortUserStore(userStores, storeSelected)
    setUserStoresSorted(sortedUserStores)
  }, [userStores])

  return (
    <View style={{ margin: 'auto', maxWidth: 500, width: '100%' }}>
      {userStores.length > 0 && !storeSelected && (
        <Text style={[gStyles.h3, { marginTop: 6 }]}>
          Selecciona una tienda
        </Text>
      )}
      <FlatList
        horizontal
        data={userStoresSorted}
        renderItem={({ item: store }) => <SquareStore store={store} />}
      />
      {storePositions?.length > 0 && !myStaffId && (
        <Text style={[gStyles.h3, { marginTop: 6 }]}>Selecciona un puesto</Text>
      )}
      <FlatList
        horizontal
        data={storePositions}
        renderItem={({ item: position }) => (
          <SquarePosition position={position} />
        )}
      />
    </View>
  )
}

const SquareStore = ({ store }) => {
  const {
    handleSetStoreId,
    storeId: storeSelected,
    handleSetMyStaffId
  } = useStore()
  const { user } = useAuth()
  const isStoreSelected = (storeId: string) => storeId === storeSelected
  const isOwner = (createdBy: string) => createdBy === user.id
  return (
    <Pressable
      key={store?.id}
      onPress={() => {
        if (store?.id === storeSelected) {
          handleSetStoreId('')
          handleSetMyStaffId('')
        } else {
          handleSetStoreId(store?.id || '')
        }
      }}
      style={[
        styles.store,
        {
          // borderColor: isStoreSelected(store.id)
          //   ? theme.secondary
          //   : 'transparent',
          backgroundColor: isStoreSelected(store?.id) ? theme.info : theme.white
        }
      ]}
    >
      <Text style={[gStyles.h3]}>{store?.name}</Text>
      <Text style={[gStyles.p, gStyles.tCenter]}>
        {isOwner(store?.createdBy) ? 'Dueño' : 'staff'}
      </Text>
    </Pressable>
  )
}

const SquarePosition = ({ position }) => {
  const { myStaffId, handleSetMyStaffId } = useStore()
  const isPositionSelected = (positionId: string) => myStaffId === positionId
  return (
    <Pressable
      key={position?.id}
      onPress={() => {
        if (position?.id === myStaffId) {
          handleSetMyStaffId('')
        } else {
          handleSetMyStaffId(position?.id || '')
        }
      }}
      style={[
        styles.store,
        {
          // borderColor: isPositionSelected(position.id)
          //   ? theme.secondary
          //   : 'transparent',
          backgroundColor: isPositionSelected(position.id)
            ? theme.info
            : theme.white
        }
      ]}
    >
      <Text style={[gStyles.h3]}>{position?.position}</Text>
      <Text style={[gStyles.p, gStyles.tCenter]}>{position?.store?.name}</Text>
    </Pressable>
  )
}

export default ChooseProfile
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
    borderRadius: 8,
    shadowColor: theme.black,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
})
