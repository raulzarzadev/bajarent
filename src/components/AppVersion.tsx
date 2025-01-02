import { View, Text, Pressable } from 'react-native'
import { gStyles } from '../styles'
import packageJson from '../../package.json'
import { useAppVersionContext } from '../contexts/appVersionContext'

const AppVersion = ({ showVersion }: { showVersion?: boolean }) => {
  const { version } = useAppVersionContext()
  const isSameVersion = version === packageJson.version

  if (isSameVersion) {
    return (
      <Text style={[gStyles.helper, { textAlign: 'right', marginRight: 4 }]}>
        ✅
      </Text>
    )
  }

  return (
    <View>
      <Pressable onPress={() => window?.location?.reload?.()}>
        <Text style={[gStyles.helper, { textAlign: 'right', marginRight: 4 }]}>
          {' 🔄 '}
        </Text>
      </Pressable>
    </View>
  )
}
export default AppVersion
