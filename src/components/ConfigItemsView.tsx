import { useState } from 'react'
import { Text, View } from 'react-native'
import { gStyles } from '../styles'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './Inputs/InputRadios'
import TextInfo from './TextInfo'

const ConfigItemsView = () => {
	type DefaultValues = {
		primaryIdentification: 'serialNumber' | 'economicNumber'
	}
	const [defaultValues, setDefaultValues] = useState<DefaultValues>({
		primaryIdentification: 'serialNumber'
	})
	const [saving, setSaving] = useState(false)

	const handleChange = (field: keyof DefaultValues, value: any) => {
		setDefaultValues(prev => ({
			...prev,
			[field]: value
		}))
	}
	const handleSaveConfig = () => {
		setSaving(true)
		// Aquí iría la lógica para guardar la configuración, por ejemplo, una llamada a una API o actualización de estado global
		console.log('Configuración guardada:', defaultValues)
		setSaving(false)
	}
	//TODO: Implementar esta funcion
	//* TODO: Para hacer esto se requiere modificar las vistas donde se muestren los datos de items. POr ejemplO:
	//* [ ] taller, en screen items, en la vista de ordenes. etc.
	//* [ ] items list
	//* [ ] item details
	//* [ ] order details
	//* [ ] orders list (para que muestre el numero economico o serial segun la configuracion)

	return (
		<View style={[gStyles.container, { gap: 16 }]}>
			<Text style={gStyles.h2}>Configuración de items</Text>
			{/* <Text style={[gStyles.helper, gStyles.tCenter]}>
        Algunas configuraciones aún estan pendientes de implementación
      </Text> */}
			<TextInfo
				text="  Algunas configuraciones aún estan pendientes de implementación"
				defaultVisible
			/>
			<InputRadios
				disabled
				label="Tipo de identificación PRINCIPAL para items"
				options={[
					{
						label: 'Numero de serie',
						value: 'serialNumber'
					},
					{
						label: 'Numero economico',
						value: 'economicNumber'
					}
				]}
				value={defaultValues.primaryIdentification}
				onChange={value => handleChange('primaryIdentification', value)}
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
