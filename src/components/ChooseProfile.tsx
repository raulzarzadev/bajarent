import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import StoreType from '../types/StoreType'
import { useAuth } from '../contexts/authContext'

const ChooseProfile = () => {
  const { navigate } = useNavigation()
  const { stores: userStores, storeId: storeSelected } = useAuth()

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
        renderItem={({ item: store }) => (
          <SquareStore store={store as StoreType & { createStore: boolean }} />
        )}
      />
    </View>
  )
}

const SquareStore = ({
  store
}: {
  store: StoreType & { createStore: boolean }
}) => {
  const { navigate } = useNavigation()
  const { storeId: storeSelected, handleSetStoreId } = useStore()
  const handleCreateStore = () => {
    // @ts-ignore
    navigate('CreateStore')
  }
  const storeIsSelected = storeSelected && store?.id === storeSelected
  return (
    <Pressable
      role="button"
      key={'createStore'}
      testID={store?.createStore ? 'createStoreButton' : 'storeButton'}
      is-selected={storeIsSelected}
      onPress={() => {
        if (store.createStore) handleCreateStore()
        if (!store.createStore) {
          if (storeIsSelected) {
            handleSetStoreId('')
          } else {
            handleSetStoreId(store.id)
          }
        }
      }}
      style={[
        styles.store,
        {
          backgroundColor: storeIsSelected ? theme.info : theme.white
        }
        //store.disabled && { opacity: 0.2, backgroundColor: '#444' }
      ]}
    >
      {store.createStore && (
        <>
          <Text style={[gStyles.h2, { marginBottom: 0 }]}>Crear tieda</Text>
          <View style={{ justifyContent: 'center', margin: 'auto' }}>
            <Icon icon="add" size={35} color={theme.black} />
          </View>
        </>
      )}
      {!store.createStore && (
        <Text
          numberOfLines={2}
          style={[
            gStyles.h3,
            { color: storeIsSelected ? theme.white : theme.black }
          ]}
        >
          {store.name}
        </Text>
      )}
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
    height: 70,
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
