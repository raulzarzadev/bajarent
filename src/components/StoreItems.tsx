import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import useCategories from '../hooks/useCategories'
import { PriceType } from '../types/PriceType'
import { priceTimeInSeconds } from '../libs/expireDate'
import { gStyles } from '../styles'
import ButtonIcon from './ButtonIcon'
import ButtonConfirm from './ButtonConfirm'
import ListStoreItems from './ListStoreItems'

const StoreItems = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[gStyles.h3, { textAlign: 'left' }]}>Artículos</Text>

      <ListStoreItems />
    </View>
  )
}

export default StoreItems

const styles = StyleSheet.create({})
