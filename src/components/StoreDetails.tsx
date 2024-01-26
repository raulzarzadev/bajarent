import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H1 from './H1'
import P from './P'
import StoreType from '../types/StoreType'
import { Icon } from 'react-native-elements'
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
      <P>Buenos dias pasadena</P>
    </View>
  )
}

export default StoreDetails

const styles = StyleSheet.create({})
