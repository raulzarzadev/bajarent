import { View, Text } from 'react-native'
import { gStyles } from '../styles'
import packageJson from '../../package.json'
import { useAppVersionContext } from '../contexts/appVersionContext'
import Button from './Button'

const AppVersion = ({
  hideCurrentVersion
}: {
  hideCurrentVersion?: boolean
}) => {
  const { version } = useAppVersionContext()
  if (version === undefined) return null
  return (
    <View>
      <Text style={[gStyles.helper, { textAlign: 'right' }]}>
        {version === packageJson.version ? (
          hideCurrentVersion ? (
            ''
          ) : (
            packageJson.version
          )
        ) : (
          <View>
            <Button
              label="Actualización"
              color="success"
              icon="refresh"
              size="xs"
              onPress={() => {
                window.location.reload()
              }}
            ></Button>
          </View>
        )}
      </Text>
    </View>
  )
}
export default AppVersion
