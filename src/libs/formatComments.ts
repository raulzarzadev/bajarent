import dictionary from '../dictionary'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { ItemHistoryType } from '../firebase/ServiceItemHistory'
import {
  CommentBase,
  CommentType,
  FormattedComment
} from '../types/CommentType'
import ItemType from '../types/ItemType'
import OrderType from '../types/OrderType'
import PaymentType from '../types/PaymentType'
import StaffType from '../types/StaffType'

export default function formatComments({
  comments,
  staff,
  orders = [],
  payments = [],
  itemMovements = [],
  items
}: {
  comments: CommentType[]
  staff: StaffType[]
  orders: OrderType[] | ConsolidatedOrderType[]
  itemMovements?: ItemHistoryType[]
  payments?: PaymentType[]
  items?: Partial<ItemType>[]
}): FormattedComment[] {
  const itemMovementsFormatted: FormattedComment[] = itemMovements.map(
    (movement) => {
      const itemDetails = items.find(({ id }) => id === movement.itemId)
      const itemNumber = itemDetails?.number || ''
      const content: Record<ItemHistoryType['type'], string> = {
        report: `${itemNumber} Reporte `,
        pickup: `${itemNumber} Recogida `,
        delivery: `${itemNumber} Entregada `,
        exchange: `${itemNumber} Cambio`,
        assignment: `${itemNumber} Asignación`,
        created: `${itemNumber} Creada `,
        fix: `${itemNumber} Reparada `,
        retire: `${itemNumber} Retirada `,
        reactivate: `${itemNumber} Reactivada`,
        exchangeDelivery: `${itemNumber} Entregada (cambio)`,
        exchangePickup: `${itemNumber} Recogida (cambio)`
      }
      return {
        ...movement,
        // createdByName: createdBy?.name || '',
        itemId: itemDetails?.id || '',
        isItemMovement: true,
        id: movement?.id || '',
        //@ts-ignore
        storeId: itemDetails.storeId || '',
        content: content[movement.type],
        createdByName:
          staff.find(
            ({ id, userId }) =>
              id === movement.createdBy || userId === movement.createdBy
          )?.name || ''
      } as FormattedComment
    }
  )
  const commentsFormatted: FormattedComment[] = comments.map((comment) => {
    const createdBy = staff?.find((st) => st.userId === comment.createdBy)
    const order = orders?.find((ord) => ord.id === comment.orderId)
    return {
      ...comment,
      createdByName: createdBy?.name || '',
      orderFolio: order?.folio,
      orderName: order?.fullName,
      orderStatus: order?.status,
      orderId: order?.id || comment.orderId,
      orderType: order?.type,
      solved: !!comment?.solved,
      isReport: comment?.type === 'report',
      isImportant: comment?.type === 'important',
      isPayment: comment?.type === 'payment',
      isItemMovement: comment?.type === 'item-movement'
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
  return [...commentsFormatted, ...paymentsFormatted, ...itemMovementsFormatted]
}
