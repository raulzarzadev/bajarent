import ListComments from './ListComments'
import { useStore } from '../contexts/storeContext'
import useComments from '../hooks/useComments'
import { ScrollView } from 'react-native'

const ScreenComments = () => {
  const { orders, staff, storeId } = useStore()

  const { comments, fetchComments } = useComments({ storeId, orders, staff })

  return (
    <ScrollView>
      <ListComments comments={comments} refetch={fetchComments} />
    </ScrollView>
  )
}

export default ScreenComments
