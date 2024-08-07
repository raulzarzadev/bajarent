import React, { useEffect } from 'react'
import { LoadingList } from './List'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import formatComments from '../libs/formatComments'
import { CommentBase, FormattedComment } from '../types/CommentType'
import { useOrdersCtx } from '../contexts/ordersContext'
import { View } from 'react-native'
import HeaderDate from './HeaderDate'
import { CommentRow } from './RowComment'
import {
  ItemHistoryType,
  ServiceItemHistory
} from '../firebase/ServiceItemHistory'
import Loading from './Loading'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'

const ListMovements = () => {
  const [data, setData] = React.useState<Partial<FormattedComment[]>>([])
  const { storeId } = useAuth()
  const { payments, staff } = useStore()
  const [loading, setLoading] = React.useState(false)
  const {
    consolidatedOrders: { orders }
  } = useOrdersCtx()

  const [date, setDate] = React.useState(new Date())
  const handleChangeDate = async (newDate: Date) => {
    try {
      setLoading(true)
      setDate(newDate)
      const itemsMovements = ServiceItemHistory.getItemsMovements({
        storeId,
        date: asDate(newDate)
      }).then(async (movements) => {
        const idsSet = new Set(movements.map(({ itemId }) => itemId))
        const items = await ServiceStoreItems.getList({
          storeId,
          ids: Array.from(idsSet)
        })

        const asMovement: Partial<FormattedComment>[] = movements.map(
          (movement) => {
            const itemDetails = items.find(({ id }) => id === movement.itemId)
            const newMovement: CommentBase &
              Pick<
                FormattedComment,
                'createdBy' | 'createdAt' | 'createdByName'
              > = {
              type: 'item-movement',
              storeId,
              orderId: movement.orderId,

              id: movement?.id || '',
              itemId: itemDetails?.id || '',
              content: movement.content,
              createdAt: movement.createdAt,
              createdBy: movement.createdBy,
              createdByName:
                staff.find(
                  ({ id, userId }) =>
                    id === movement.createdBy || userId === movement.createdBy
                )?.name || ''
            }
            const itemNumber = itemDetails?.number || ''
            const content: Record<ItemHistoryType['type'], string> = {
              report: `${itemNumber} Reporte `,
              pickup: `${itemNumber} Recogida `,
              delivery: `${itemNumber} Entregada `,
              exchange: `${itemNumber} Cambio `,
              assignment: `${itemNumber} Asignación`,
              created: `${itemNumber} Creada `,
              fix: `${itemNumber} Reparada `,
              retire: `${itemNumber} Retirada `,
              reactivate: `${itemNumber} Reactivada`
            }
            newMovement.content = content[movement.type]
            return newMovement
          }
        )

        return asMovement
      })
      const ordersMovements = ServiceComments.getByDate(storeId, newDate).then(
        async (comments) => {
          const todayPayments = payments.filter(({ createdAt }) => {
            return isToday(asDate(createdAt))
          })
          const movements = formatComments({
            comments,
            orders: Object.values(orders),
            staff,
            payments: todayPayments
          })
          return movements
        }
      )

      const res: Partial<FormattedComment[]> = await Promise.all([
        itemsMovements,
        ordersMovements
      ]).then((res) => res.flat() as Partial<FormattedComment[]>)
      setLoading(false)
      setData(res)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleChangeDate(date)
  }, [])

  return (
    <View>
      <HeaderDate
        label="Movimientos"
        onChangeDate={handleChangeDate}
        debounce={700}
      />
      {loading && <Loading />}
      <LoadingList
        ComponentRow={({ item }) => <CommentRow comment={item} showOrder />}
        data={data}
        filters={[
          { field: 'type', label: 'Tipo' },
          {
            field: 'orderType',
            label: 'Tipo de orden'
          },
          {
            field: 'createdByName',
            label: 'Usuario'
          }
        ]}
        defaultSortBy={'createdAt'}
        defaultOrder="des"
      />
    </View>
  )
}

export default ListMovements
