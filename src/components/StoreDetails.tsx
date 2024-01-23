import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import H1 from './H1'
import P from './P'
import StoreType from '../types/StoreType'

const StoreDetails = ({ store }: { store: StoreType }) => {
  return (
    <View>
      <H1>{store?.name}</H1>
      <P>Buenos dias pasadena</P>
    </View>
  )
}

export default StoreDetails

const styles = StyleSheet.create({})
