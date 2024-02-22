import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import ListBalances from './ListBalances'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { useStore } from '../contexts/storeContext'

const ScreenBalances = () => {
  const [balances, setBalances] = React.useState([])
  const { storeId } = useStore()
  useEffect(() => {
    const fetchBalances = async () => {
      const balances = await ServiceBalances.getByStore(storeId)
      setBalances(balances)
    }
    if (storeId) {
      fetchBalances()
    }
  }, [])
  return (
    <View>
      <ListBalances balances={balances} />
    </View>
  )
}

export default ScreenBalances

const styles = StyleSheet.create({})
