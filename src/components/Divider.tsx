import { StyleSheet, View } from 'react-native'

const Divider = ({ mv = 8 }) => {
	return <View style={{ ...styles.divider, marginVertical: mv }} />
}

const styles = StyleSheet.create({
	divider: {
		height: 1,
		backgroundColor: '#E0E0E0',
		marginVertical: 8
	}
})

export default Divider
