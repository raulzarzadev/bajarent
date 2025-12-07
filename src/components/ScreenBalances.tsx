import { ScrollView, StyleSheet, View } from 'react-native'
import { useState, useEffect } from 'react'
import ListBalances from './ListBalances'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { useStore } from '../contexts/storeContext'

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

const styles = StyleSheet.create({})
