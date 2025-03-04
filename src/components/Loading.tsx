import { ActivityIndicator } from 'react-native'

const Loading = ({ size = 22 }: { size?: number }) => {
  return <ActivityIndicator size={size} />
}

export default Loading
