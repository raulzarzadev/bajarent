import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H1 from './H1'
import P from './P'
import StoreType from '../types/StoreType'
import ButtonIcon from './ButtonIcon'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { useStoreNavigation } from './StackStore'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useStoreNavigation()

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

export const ChangeStore = ({ label = '' }) => {
  const storesModal = useModal({ title: 'Seleccionar tienda' })
  const {
    handleSetStoreId,
    storeId,
    userStores
    // userPositions,
    // handleSetMyStaffId,
    // myStaffId
  } = useStore()
  // console.log({ userStores, userPositions })
  // console.log({ handleSetMyStaffId, myStaffId })
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!!label && <Text>{label}</Text>}
        <ButtonIcon
          icon={storeId ? 'autorenew' : 'storefront'}
          variant="ghost"
          color="secondary"
          buttonStyles={{ marginLeft: 10, width: 40, height: 40 }}
          size="medium"
          onPress={() => {
            storesModal.toggleOpen()
            // navigate('EditStore')
          }}
        ></ButtonIcon>
      </View>
      <StyledModal {...storesModal}>
        <View>
          {!!userStores.length && <P bold>Tiendas propias</P>}
          {userStores.map((store) => (
            <Pressable
              key={store.id}
              onPress={() => {
                handleSetStoreId(store.id)
              }}
              style={{
                padding: 8,
                borderRadius: 8,
                borderColor:
                  storeId === store.id ? theme.secondary : 'transparent',
                borderWidth: 1,
                backgroundColor:
                  storeId === store.id ? theme.primary : 'transparent'
              }}
            >
              <View style={styles.store} key={store.id}>
                <Text>{store.name}</Text>
              </View>
            </Pressable>
          ))}
          {/* {!!userPositions.length && <P bold>Posiciones</P>}
          {userPositions.map((position) => (
            <Pressable
              key={position.id}
              onPress={() => {
                handleSetStoreId(position.storeId)
                handleSetMyStaffId(position.id)
              }}
              style={{
                padding: 8,
                borderRadius: 8,
                borderColor:
                  myStaffId === position.id ? theme.secondary : 'transparent',
                borderWidth: 1,
                backgroundColor:
                  myStaffId === position.id ? theme.primary : 'transparent'
              }}
            >
              <View style={styles.store} key={position.id}>
                <Text style={{ textAlign: 'center' }}>
                  {position?.store?.name}
                </Text>
                <Text>{position?.position}</Text>
              </View>
            </Pressable>
          ))} */}
          {!!storeId && (
            <Pressable
              style={{
                padding: 8,
                borderRadius: 8,
                borderColor: 'transparent',
                borderWidth: 1,
                backgroundColor: 'transparent'
              }}
              onPress={() => {
                handleSetStoreId('')
              }}
            >
              <View style={[styles.store]}>
                <Text style={{ textAlign: 'center' }}>Salir</Text>
              </View>
            </Pressable>
          )}
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
