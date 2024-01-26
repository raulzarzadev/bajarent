import { StyleSheet, View } from 'react-native'
import React from 'react'
import H1 from './H1'
import P from './P'
import StoreType from '../types/StoreType'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'

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

export default StoreDetails

const styles = StyleSheet.create({})
