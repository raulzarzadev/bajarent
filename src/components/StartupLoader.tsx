import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { gStyles } from '../styles'
import theme from '../theme'
import Button from './Button'

export type StartupLoaderProps = {
	title: string
	description?: string
	handleTimeout?: () => void
}

const StartupLoader = ({ title, description, handleTimeout }: StartupLoaderProps) => {
	const [hasTimedOut, setHasTimedOut] = React.useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setHasTimedOut(true)
		}, 15000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
				backgroundColor: theme.white
			}}
		>
			<ActivityIndicator size="large" color={theme.primary} />
			<Text style={[gStyles.h2, { marginTop: 16, textAlign: 'center' }]}>{title}</Text>
			{!!description && (
				<Text style={[gStyles.helper, { textAlign: 'center', marginTop: 4 }]}>{description}</Text>
			)}
			{hasTimedOut && handleTimeout && (
				<View>
					<Text
						style={[
							gStyles.helper,
							{
								textAlign: 'center',
								marginTop: 12,
								color: theme.error,
								marginBottom: 12
							}
						]}
					>
						Ha tardado más de lo esperado. Por favor, verifica tu conexión a internet.
					</Text>
					<Button onPress={handleTimeout} variant="ghost" label="Cancelar"></Button>
				</View>
			)}
		</View>
	)
}

export default StartupLoader
