import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gStyles } from '../styles'
import StaffType from '../types/StaffType'
import { useAuth } from '../contexts/authContext'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'

const ChooseProfile = () => {
  const { navigate } = useNavigation()
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
    let res = []
    const selectedStore = userStores?.find(
      (store) => store?.id === storeSelected
    )
    const otherStores = userStores?.filter(
      (store) => store?.id !== storeSelected
    )
    if (selectedStore) {
      res.push(selectedStore)
    }
    res = res.concat(otherStores)
    return res
  }

  const [userStoresSorted, setUserStoresSorted] = React.useState(userStores)

  useEffect(() => {
    const sortedUserStores = sortUserStore(userStores, storeSelected)
    setUserStoresSorted(sortedUserStores)
  }, [userStores])

  const handleCreateStore = () => {
    // @ts-ignore
    navigate('CreateStore')
  }

  const stores =
    [
      ...userStoresSorted,
      { createStore: true, handleCreateStore, disabled: false }
    ] || []

  return (
    <View style={{ margin: 'auto', maxWidth: 500 }}>
      <Text>Selecciona una tienda</Text>
      <FlatList
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        horizontal
        data={stores}
        renderItem={({ item: store }) => <SquareStore store={store} />}
      />
    </View>
  )
}

const SquareStore = ({ store }) => {
  if (store?.createStore) {
    return (
      <Pressable
        role="button"
        disabled={store.disabled}
        key={'createStore'}
        onPress={() => {
          store.handleCreateStore()
        }}
        style={[
          styles.store,
          {
            backgroundColor: theme.info
          },
          store.disabled && { opacity: 0.2, backgroundColor: '#444' }
        ]}
      >
        <Text style={[gStyles.h3, { color: theme.white }]}>Crear tienda</Text>
        <View style={{ margin: 'auto' }}>
          <Icon icon="add" size={40} color={theme.white} />
        </View>
      </Pressable>
    )
  }
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

export default ChooseProfile
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  store: {
    borderWidth: 2,
    borderColor: 'transparent',
    width: 120,
    height: 80,
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
