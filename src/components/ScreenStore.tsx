import { StyleSheet, View } from 'react-native'
import React from 'react'
import StoreDetails, { ChangeStore } from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'

const ScreenStore = ({ navigation }) => {
  const { store, userStores, storeId } = useStore()
  return (
    <View>
      {!!userStores.length && !storeId && <ChangeStore label="Entrar " />}
      {store && (
        <>
          <StoreDetails store={store} />
          <Button
            buttonStyles={{
              width: 100,
              margin: 'auto',
              marginVertical: 16
            }}
            onPress={() => {
              navigation.navigate('Staff')
            }}
          >
            Staff
          </Button>
        </>
      )}
    </View>
  )
}

export default ScreenStore
