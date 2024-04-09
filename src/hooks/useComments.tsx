import { useEffect, useState } from 'react'
import { ServiceComments } from '../firebase/ServiceComments'
import { FormattedComment } from '../types/CommentType'
import StaffType from '../types/StaffType'
import OrderType from '../types/OrderType'
import formatComments from '../libs/formatComments'

export default function useComments({
  storeId,
  staff,
  orders
}: {
  storeId: string
  staff: StaffType[]
  orders: OrderType[]
}) {
  const [comments, setComments] = useState<FormattedComment[]>([])
  const fetchComments = () => {
    ServiceComments.getByStore(storeId)
      .then((res) => {
        setComments(formatComments({ comments: res, staff, orders }))
      })
      .catch((err) => {
        console.log('error fetching comments', err)
      })
  }

  useEffect(() => {
    if (storeId && orders.length > 0 && staff.length > 0) fetchComments()
  }, [storeId, orders.length, staff.length])
  return { comments, fetchComments }
}
