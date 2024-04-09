import ListComments from './ListComments'
import { useStore } from '../contexts/storeContext'

const ScreenComments = () => {
  const { allComments: comments } = useStore()
  return <ListComments comments={comments} />
}

export default ScreenComments
