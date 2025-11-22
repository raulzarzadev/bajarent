import { ActivityIndicator } from 'react-native'

const Loading = ({ size = 22, id }: { size?: number; id?: string }) => {
  return <ActivityIndicator size={size} id={id} />
}

export default Loading
