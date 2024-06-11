import dictionary from '../dictionary'
import { CommentType, FormattedComment } from '../types/CommentType'
import OrderType from '../types/OrderType'
import PaymentType from '../types/PaymentType'
import StaffType from '../types/StaffType'

export default function formatComments({
  comments,
  staff,
  orders = [],
  payments = []
}: {
  comments: CommentType[]
  staff: StaffType[]
  orders: OrderType[]
  payments?: PaymentType[]
}): FormattedComment[] {
  const commentsFormatted: FormattedComment[] = comments.map((comment) => {
    const createdBy = staff?.find((st) => st.userId === comment.createdBy)
    const order = orders?.find((ord) => ord.id === comment.orderId)
    return {
      ...comment,
      createdByName: createdBy?.name || '',
      orderFolio: order?.folio,
      orderName: order?.fullName,
      orderStatus: order?.status,
      orderType: order?.type,
      solved: !!comment?.solved
    }
  })
  const paymentsFormatted: FormattedComment[] = payments?.map((payment) => {
    const createdBy = staff?.find((st) => st.userId === payment.createdBy)
    const order = orders?.find((ord) => ord.id === payment.orderId)
    const paymentAmount = parseFloat(`${payment?.amount || 0}`)
    return {
      createdByName: createdBy?.name || '',
      orderFolio: order?.folio,
      orderName: order?.fullName,
      orderStatus: order?.status,
      orderType: order?.type,
      content: `${dictionary(payment.method)} $${paymentAmount?.toFixed(2)}`,
      type: 'payment',
      id: payment?.id,
      orderId: payment?.orderId,
      storeId: payment?.storeId,
      createdAt: payment?.createdAt,
      status: 'open',
      solved: false,
      solvedAt: null,
      solvedBy: null,
      solvedComment: null,
      createdBy: payment?.createdBy,
      updatedBy: null,
      updatedAt: null
    }
  })
  return [...commentsFormatted, ...paymentsFormatted]
}
