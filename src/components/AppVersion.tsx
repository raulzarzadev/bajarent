import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import packageJson from '../../package.json'
import { ServiceInternalConfig } from '../firebase/ServiceInternalConfig'
import { versionCompare } from '../libs/versionCompare'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'

const AppVersion = () => {
	const [version, setVersion] = useState()
	const isSameVersion = version === packageJson.version

	useEffect(() => {
		ServiceInternalConfig.listenVersion(setVersion)
	}, [])

	if (isSameVersion) {
		return (
			<Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
				{packageJson.version} ✅
			</Text>
		)
	}

	//* 🔄 Significa que remote-version esta adelantada, pronto habra una actualización disponible
	//* ⏳ Significa  que remote-version esta atrasada, esta version esta adelantada.
	//* ✅ Significa que remote-version y el proyecto actual estan sincronizados

	const isVersionForwards = versionCompare(version, packageJson.version) === 1
	if (isVersionForwards) {
		return (
			<View>
				<Pressable onPress={() => window?.location?.reload?.()}>
					<Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
						{packageJson.version} 🔄
					</Text>
				</Pressable>
			</View>
		)
	}
	return (
		<Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
			{packageJson.version} ⏳
		</Text>
	)
}
export default AppVersion

export type AppVersionProps = {}
export const AppVersionE = (props: AppVersionProps) => (
	<ErrorBoundary componentName="AppVersion">
		<AppVersion {...props} />
	</ErrorBoundary>
)
