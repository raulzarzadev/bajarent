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
  const fetchComments = (props?: { id?: string; count?: number }) => {
    const id = props?.id
    const count = props?.count

    if (count) {
      return ServiceComments.getLast(storeId, count).then((res) => {
        const formatted = formatComments({ comments: res, orders, staff })
        setComments(formatted)
      })
    }

    if (id) {
      return ServiceComments.get(id).then((res) => {
        const formatted = formatComments({ comments: [res], orders, staff })
        setComments(comments.map((c) => (c.id === res.id ? formatted[0] : c)))
      })
    }

    ServiceComments.getLast(storeId, 10).then((res) => {
      const formatted = formatComments({ comments: res, orders, staff })
      setComments(formatted)
    })
  }
  useEffect(() => {
    if (orders.length && staff.length) fetchComments()
  }, [orders.length, staff.length])

  return { comments, fetchComments }
}
