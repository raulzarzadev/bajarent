import { useState } from 'react'
import { View } from 'react-native'
import theme from '../theme'
import ErrorBoundary from './ErrorBoundary'
import InputPhone from './InputPhone'
import InputCheckbox from './Inputs/InputCheckbox'
import InputRadios from './Inputs/InputRadios'

const Inputs = () => {
	const [checked, setChecked] = useState(false)
	const [phone, setPhone] = useState('')
	return (
		<View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
				<InputCheckbox label="Checkbox" setValue={setChecked} />
				<InputCheckbox label="Controlled checked" setValue={setChecked} value={checked} />
			</View>
			<View>
				<InputRadios
					value="3"
					options={[
						{
							label: 'Radio 1',
							value: '1',
							color: theme.error
						},
						{
							label: 'Radio 2',
							value: '2'
						},
						{
							label: 'label icon',
							value: '3',
							iconLabel: 'siren',
							color: theme.error
						},
						{
							label: 'check icon',
							value: '4',
							iconCheck: 'truck',
							color: theme.primary
						},
						{
							label: 'disabled',
							value: '5',
							disabled: true
						}
					]}
				/>
				<InputRadios
					variant="ghost"
					value="1"
					options={[
						{
							label: 'Radio 1',
							value: '1'
						},
						{
							label: 'Radio 2',
							value: '2',
							color: theme.error
						},
						{
							label: 'label icon',
							value: '3',
							iconLabel: 'siren',
							color: theme.success
						},
						{
							label: 'check icon',
							value: '4',
							iconCheck: 'truck',
							color: theme.primary
						},
						{
							label: 'disabled',
							value: '5',
							disabled: true
						}
					]}
				/>
			</View>
			<View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
				<InputPhone
					onChange={phone => {
						setPhone(phone)
					}}
					defaultNumber={phone}
				/>
				<InputPhone onChange={phone => setPhone(phone)} defaultNumber={'+52554336e345'} />
			</View>
		</View>
	)
}
export const InputsE = () => {
	return (
		<ErrorBoundary componentName="Inputs">
			<Inputs />
		</ErrorBoundary>
	)
}
export default Inputs
