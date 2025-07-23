import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { Link } from '@react-navigation/native'
import Icon from '../Icon'
import Button from '../Button'
import theme from '../../theme'
const LinkModalCurrentWork = (props?: LinkModalCurrentWorkProps) => {
  return (
    <View>
      <Link
        to={{
          screen: 'StackCurrentWork',
          params: { screen: 'ScreenCurrentWork' }
        }}
        style={{
          width: '100%',
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: theme.primary
        }}
      >
        <Icon icon="folderCheck" size={24} color="primary" />
      </Link>
    </View>
  )
}
export default LinkModalCurrentWork
export type LinkModalCurrentWorkProps = {}
export const LinkModalCurrentWorkE = (props: LinkModalCurrentWorkProps) => (
  <ErrorBoundary componentName="LinkModalCurrentWork">
    <LinkModalCurrentWork {...props} />
  </ErrorBoundary>
)
