import { CommentType, FormattedComment } from '../types/CommentType'
import OrderType from '../types/OrderType'
import StaffType from '../types/StaffType'

export default function formatComments({
  comments,
  staff,
  orders
}: {
  comments: CommentType[]
  staff: StaffType[]
  orders: OrderType[]
}): FormattedComment[] {
  return comments.map((comment) => {
    const createdBy = staff?.find((st) => st.userId === comment.createdBy)
    const order = orders?.find((ord) => ord.id === comment.orderId)
    return {
      ...comment,
      createdByName: createdBy?.name || '',
      orderFolio: order?.folio,
      orderName: order?.fullName,
      orderStatus: order?.status,
      orderType: order?.type
    }
  })
}
