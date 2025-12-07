import { FlatList, StyleSheet, View } from 'react-native'
import Button, { type ButtonProps } from './Button'
import type { IconName } from './Icon'

type ButtonType = {
	variant: ButtonProps['variant']
	color: ButtonProps['color']
	title: string
	icon?: IconName
	justIcon?: boolean
}
const buttons: ButtonType[] = [
	{ variant: 'filled', color: 'primary', title: 'Filled primary' },
	{ variant: 'filled', color: 'secondary', title: 'Filled secondary' },
	{ variant: 'filled', color: 'success', title: 'Filled success' },
	{ variant: 'filled', color: 'error', title: 'Filled danger' },
	{ variant: 'filled', color: 'warning', title: 'Filled warning' },
	{ variant: 'filled', color: 'info', title: 'Filled info' },
	{ variant: 'outline', color: 'primary', title: 'Outlined primary' },
	{ variant: 'outline', color: 'secondary', title: 'Outlined secondary' },
	{ variant: 'outline', color: 'success', title: 'Outlined success' },
	{ variant: 'outline', color: 'error', title: 'Outlined danger' },
	{ variant: 'outline', color: 'warning', title: 'Outlined warning' },
	{ variant: 'outline', color: 'info', title: 'Outlined info' },
	{ variant: 'ghost', color: 'primary', title: 'Ghost primary' },
	{ variant: 'ghost', color: 'secondary', title: 'Ghost secondary' },
	{ variant: 'ghost', color: 'success', title: 'Ghost success' },
	{ variant: 'ghost', color: 'error', title: 'Ghost danger' },
	{ variant: 'ghost', color: 'warning', title: 'Ghost warning' },
	{ variant: 'ghost', color: 'info', title: 'Ghost info' },
	{ variant: 'filled', color: 'black', title: 'Filled black', icon: 'filter' },
	{
		variant: 'outline',
		color: 'success',
		title: 'Outlined success icon',
		icon: 'filter'
	},
	{
		variant: 'filled',
		color: 'black',
		title: 'Filled black',
		icon: 'filter',
		justIcon: true
	},
	{
		variant: 'ghost',
		color: 'primary',
		title: 'Ghost primary just icon',
		icon: 'filter',
		justIcon: true
	},
	{
		variant: 'outline',
		color: 'error',
		title: ' Outline danger just icon',
		icon: 'filter',
		justIcon: true
	},
	{
		variant: 'outline',
		color: 'warning',
		title: ' Outline warning just icon',
		icon: 'filter',
		justIcon: true
	}
	// Agrega aquí más botones si es necesario
]

const Buttons = () => {
	return (
		<FlatList
			data={buttons}
			renderItem={({ item }) => (
				<View style={styles.buttonContainer}>
					<Button
						onPress={() => {}}
						variant={item.variant}
						color={item.color}
						icon={item.icon}
						justIcon={item.justIcon}
					>
						{item.title}
					</Button>
				</View>
			)}
			keyExtractor={item => item.title}
			numColumns={2} // Cambia este número para controlar cuántos botones se muestran por fila
			contentContainerStyle={styles.list}
		/>
	)
}
const styles = StyleSheet.create({
	list: {
		paddingHorizontal: 10
	},
	buttonContainer: {
		flex: 1,
		padding: 10
	}
})

export default Buttons
