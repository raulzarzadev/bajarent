import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceBalances } from '../firebase/ServiceBalances'
import ListBalances from './ListBalances'

const ScreenBalances = () => {
  const [balances, setBalances] = useState([])
  const { store } = useStore()
  useEffect(() => {
    const fetchBalances = async () => {
      const balances = await ServiceBalances.getByStore(store?.id)
      setBalances(balances)
    }
    if (store?.id) fetchBalances()
  }, [store?.id])
  return (
    <ScrollView>
      <ListBalances balances={balances} />
    </ScrollView>
  )
}

export default ScreenBalances
