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
  const fetchComments = (props?: { id?: string }) => {
    const id = props?.id
    if (id) {
      ServiceComments.get(id).then((res) => {
        const formatted = formatComments({ comments: [res], orders, staff })
        setComments(comments.map((c) => (c.id === res.id ? formatted[0] : c)))
      })
    } else {
      ServiceComments.getLast(storeId, 10).then((res) => {
        const formatted = formatComments({ comments: res, orders, staff })
        setComments(formatted)
      })
    }
  }
  useEffect(() => {
    if (orders.length && staff.length) fetchComments()
  }, [orders.length, staff.length])

  return { comments, fetchComments }
}
