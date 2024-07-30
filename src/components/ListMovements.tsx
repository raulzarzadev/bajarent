import React, { useEffect } from 'react'
import { LoadingList } from './List'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { CommentType } from './ListComments'
import { useStore } from '../contexts/storeContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import formatComments from '../libs/formatComments'
import { comment_types, FormattedComment } from '../types/CommentType'
import { useOrdersCtx } from '../contexts/ordersContext'
import { View } from 'react-native'
import HeaderDate from './HeaderDate'
import { CommentRow } from './RowComment'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import dictionary from '../dictionary'
import Loading from './Loading'

const ListMovements = () => {
  const [data, setData] = React.useState<Partial<FormattedComment[]>>([])
  const { storeId } = useAuth()
  const { payments, staff, items, storeSections } = useStore()
  const [loading, setLoading] = React.useState(false)
  const { orders } = useOrdersCtx()

  const [date, setDate] = React.useState(new Date())
  const handleChangeDate = async (newDate: Date) => {
    try {
      setLoading(true)
      setDate(newDate)
      const itemsMovements = ServiceItemHistory.getItemsMovements({
        storeId,
        date: asDate(newDate),
        items: items?.map(({ id }) => id) || []
      }).then((res) => {
        const asMovement: Partial<CommentType>[] = res.map((movement) => {
          const itemDetails = items.find(({ id }) => id === movement.itemId)
          return {
            type: comment_types['item-movement'],
            title: 'hola',
            createdAt: movement.createdAt,
            user: movement.createdBy,
            createdBy: movement.createdBy,
            storeId,
            orderId: movement.orderId,
            // content: ` ${
            //   itemDetails?.number
            //     ? `Artículo no. ${itemDetails?.number}  ${dictionary(
            //         movement.type
            //       )}`
            //     : `${dictionary(movement.type)}`
            // }`,
            content: `Asigno el artículo ${itemDetails?.number || ''} al area ${
              storeSections.find(
                (section) => section?.id === itemDetails?.assignedSection
              )?.name || ''
            }`,
            id: movement?.id || '',
            itemId: itemDetails?.id || ''
          }
        })
        return asMovement
      })
      const ordersMovements = ServiceComments.getByDate(storeId, newDate).then(
        async (comments) => {
          const todayPayments = payments.filter(({ createdAt }) => {
            return isToday(asDate(createdAt))
          })
          const movements = await formatComments({
            comments,
            orders,
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
