import { View } from 'react-native'
import React from 'react'
import StoreDetails, { ChangeStore } from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'

const ScreenStore = ({ navigation }) => {
  const { store, userStores, userPositions } = useStore()

  console.log({ userPositions, userStores })

  const hasStores = userStores.length > 1 || userPositions.length > 1
  return (
    <View>
      {hasStores && !store && <ChangeStore label="Entrar " />}
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
