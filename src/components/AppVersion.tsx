import { View, Text, Pressable } from 'react-native'
import { gStyles } from '../styles'
import packageJson from '../../package.json'
import { useAppVersionContext } from '../contexts/appVersionContext'
import { versionCompare } from '../libs/versionCompare'
import ErrorBoundary from './ErrorBoundary'

const AppVersion = () => {
  const { version } = useAppVersionContext()
  const isSameVersion = version === packageJson.version

  const isVersionForwards = versionCompare(version, packageJson.version) === 1
  if (isSameVersion) {
    return (
      <Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
        {packageJson.version} ✅
      </Text>
    )
  }
  if (isVersionForwards) {
    return (
      <Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
        {packageJson.version} ⏳
      </Text>
    )
  }

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
export default AppVersion

export type AppVersionProps = {}
export const AppVersionE = (props: AppVersionProps) => (
  <ErrorBoundary componentName="AppVersion">
    <AppVersion {...props} />
  </ErrorBoundary>
)
