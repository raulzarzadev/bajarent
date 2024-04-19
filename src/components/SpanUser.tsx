import { Text } from 'react-native'
import { useStore } from '../contexts/storeContext'

const SpanUser = ({ userId }) => {
  const { staff } = useStore()
  const userName = staff.find((s) => s.userId === userId)?.name
  return <Text numberOfLines={1}>{userName}</Text>
}

export default SpanUser
