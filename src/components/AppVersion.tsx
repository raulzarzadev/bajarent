import { View, Text, Pressable } from 'react-native'
import { gStyles } from '../styles'
import packageJson from '../../package.json'
import { useAppVersionContext } from '../contexts/appVersionContext'

const AppVersion = () => {
  const { version } = useAppVersionContext()
  const isSameVersion = version === packageJson.version

  if (isSameVersion) {
    return (
      <Text style={[gStyles.helper, { textAlign: 'right', marginRight: 8 }]}>
        {packageJson.version} ✅
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
