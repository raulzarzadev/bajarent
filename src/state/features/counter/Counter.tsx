import type React from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/Button'
import { gStyles } from '../../../styles'
import { decrement, increment, selectCounter } from './counterSlice'

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
