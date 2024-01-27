import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import H1 from './H1'
import P from './P'
import StoreType from '../types/StoreType'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { useStore } from '../contexts/storeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useNavigation()

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChangeStore />
        <H1>{store?.name}</H1>
        <ButtonIcon
          icon="edit"
          variant="ghost"
          color="secondary"
          buttonStyles={{ marginLeft: 10 }}
          size="medium"
          onPress={() => {
            navigate('EditStore')
          }}
        ></ButtonIcon>
      </View>
      <P>{store.description}</P>
    </View>
  )
}

export const ChangeStore = () => {
  const storesModal = useModal({ title: 'Seleccionar tienda' })
  const { user } = useAuth()
  const [stores, setStores] = React.useState([])
  const { handleSetStoreId, storeId } = useStore()
  useEffect(() => {
    if (user) {
      ServiceStores.getStoresByUserId(user.id)
        .then(setStores)
        .catch(console.error)
    }
  }, [user])
  return (
    <View>
      <ButtonIcon
        icon="autorenew"
        variant="ghost"
        color="secondary"
        buttonStyles={{ marginLeft: 10, width: 40, height: 40 }}
        size="medium"
        onPress={() => {
          storesModal.toggleOpen()
          // navigate('EditStore')
        }}
      ></ButtonIcon>
      <StyledModal {...storesModal}>
        <View>
          {stores.map((store) => (
            <Pressable
              style={{
                padding: 8,
                borderRadius: 8,
                borderColor:
                  storeId === store.id ? theme.secondary : 'transparent',
                borderWidth: 1,
                backgroundColor:
                  storeId === store.id ? theme.primary : 'transparent'
              }}
              key={store.id}
              onPress={() => {
                handleSetStoreId(store.id)
              }}
            >
              <View style={styles.store} key={store.id}>
                <Text>{store.name}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </StyledModal>
    </View>
  )
}

export default StoreDetails

const styles = StyleSheet.create({
  store: {
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  }
})
