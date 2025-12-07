import { StyleSheet, Text, View } from 'react-native'
import { gStyles } from '../styles'
import type OrderType from '../types/OrderType'

export const ItemOrderDetails = ({ item }: { item: OrderType['item'] }) => {
	//const { items } = useStore()
	//FIXME: items is not defined
	const items = []
	const itemDetails = items.find(i => i?.id === item?.id)

	return (
		<View>
			{!!itemDetails?.categoryName && (
				<>
					<Text style={styles.title}>Categoria:</Text>
					<Text style={styles.value}>{itemDetails?.categoryName}</Text>
				</>
			)}
			{!!itemDetails?.brand && (
				<>
					<Text style={styles.title}>Marca:</Text>
					<Text style={styles.value}>{itemDetails?.brand}</Text>
				</>
			)}
			{!!itemDetails?.serial && (
				<>
					<Text style={styles.title}>Serie:</Text>
					<Text style={styles.value}>{itemDetails?.serial}</Text>
				</>
			)}
			{!!itemDetails?.number && (
				<>
					<Text style={styles.title}>Numero :</Text>
					<Text style={[styles.value, gStyles.h2]}>{itemDetails?.number}</Text>
				</>
			)}

			{/* {!!itemDetails?.failDescription && (
        <>
          <Text style={styles.title}>Falla</Text>
          <Text style={styles.value}>{itemDetails?.failDescription}</Text>
        </>
      )} */}
		</View>
	)
}

export default ItemOrderDetails

const styles = StyleSheet.create({
	title: {
		...gStyles.helper,
		textAlign: 'center'
	},
	value: {
		...gStyles.tBold,
		textAlign: 'center'
	}
})
