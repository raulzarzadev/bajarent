import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ListBalances from './ListBalances'

const ScreenBalances = () => {
  return (
    <View>
      <ListBalances balances={[]} />
    </View>
  )
}

export default ScreenBalances

const styles = StyleSheet.create({})
