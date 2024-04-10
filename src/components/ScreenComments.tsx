import ListComments from './ListComments'
import { useStore } from '../contexts/storeContext'
import useComments from '../hooks/useComments'

const ScreenComments = () => {
  const { orders, staff, storeId } = useStore()

  const { comments, fetchComments } = useComments({ storeId, orders, staff })

  return <ListComments comments={comments} refetch={fetchComments} />
}

export default ScreenComments
