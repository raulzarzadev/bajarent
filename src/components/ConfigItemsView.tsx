import { useState } from 'react'
import { Text, View } from 'react-native'
import { ServiceStores } from '../firebase/ServiceStore'
import { useShop } from '../hooks/useShop'
import { gStyles } from '../styles'
import type StoreType from '../types/StoreType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './Inputs/InputRadios'

const ConfigItemsView = () => {
	const { shop } = useShop()
	type Values = StoreType['preferences']

	const [values, setValues] = useState<Values>(shop?.preferences || {})
	const [saving, setSaving] = useState(false)

	const handleChange = (field: keyof Values, value: any) => {
		setValues(prev => ({
			...prev,
			[field]: value
		}))
	}
	const handleSaveConfig = () => {
		setSaving(true)
		// Aquí iría la lógica para guardar la configuración, por ejemplo, una llamada a una API o actualización de estado global
		ServiceStores.update(shop.id, { preferences: values })
		console.log('Configuración guardada:', values)
		setSaving(false)
	}
	//TODO: Implementar esta funcion. Esto permite ver
	//* TODO: Para hacer esto se requiere modificar las vistas donde se muestren los datos de items. POr ejemplO:
	//* [ ] taller, en screen items, en la vista de ordenes. etc.
	//* [ ] items list
	//* [ ] item details
	//* [ ] order details
	//* [ ] orders list (para que muestre el numero economico o serial segun la configuracion)
	//* [ ] balance screen

	return (
		<View style={[gStyles.container, { gap: 16 }]}>
			<Text style={gStyles.h2}>Configuración de items</Text>

			<InputRadios
				label="Tipo de identificación PRINCIPAL para items"
				options={[
					{
						label: 'Numero economico',
						value: 'economicNumber'
					},
					{
						label: 'Numero de serie',
						value: 'serialNumber'
					},
					{
						label: 'Id. de inventario',
						value: 'sku'
					}
				]}
				value={values.itemIdentifier}
				onChange={value => handleChange('itemIdentifier', value)}
				helperText="Esto define el tamaño con el que se muestran ciertos atributos de los items"
			/>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					marginVertical: 16,
					width: '100%',
					marginHorizontal: 'auto'
				}}
			>
				<Button
					disabled={saving}
					label="Guardar"
					icon="save"
					onPress={() => {
						handleSaveConfig()
					}}
					size="small"
				></Button>
			</View>
		</View>
	)
}
export default ConfigItemsView
export const ConfigItemsViewE = () => (
	<ErrorBoundary componentName="ConfigItemsView">
		<ConfigItemsView />
	</ErrorBoundary>
)
