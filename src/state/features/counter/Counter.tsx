import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, selectCounter } from './counterSlice'
import { Text, View } from 'react-native'
import Button from '../../../components/Button'
import { gStyles } from '../../../styles'

const Counter: React.FC = () => {
	const count = useSelector(selectCounter)
	const dispatch = useDispatch()

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View>
				<Button label="-" onPress={() => dispatch(decrement())} />
				<Text style={gStyles.h3}>{count}</Text>
				<Button label="+" onPress={() => dispatch(increment())} />
			</View>
		</View>
	)
}

export default Counter
