import { Text, View, ViewStyle } from 'react-native'
import React from 'react'
import Button from './Button'
import Chip from './Chip'
import dictionary from '../dictionary'
import { fromNow } from '../libs/utils-date'
import theme from '../theme'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'
import OrderType from '../types/OrderType'
import { gStyles } from '../styles'
import { useNavigation } from '@react-navigation/native'
import List from './List'
import { FormattedComment } from '../types/CommentType'

export type CommentType = OrderType['comments'][number]

const ListComments = ({
  comments,
  style,
  viewOrder,
  refetch
}: {
  comments: FormattedComment[]
  style?: ViewStyle
  viewOrder?: boolean
  refetch?: () => void
}) => {
  return (
    <View style={[{ width: '100%' }, style]}>
      <List
        defaultOrder="des"
        defaultSortBy="createdAt"
        ComponentRow={(props) => (
          <CommentRow
            comment={props.item}
            viewOrder
            key={props.item.id}
            refetch={refetch}
          />
        )}
        data={comments}
        filters={[
          { field: 'solved', label: 'Resuelto', boolean: true },
          { field: 'createdBy', label: 'Creado por' },
          { field: 'type', label: 'Tipo' }
        ]}
        sortFields={[
          { label: 'Fecha', key: 'createdAt' },
          { label: 'Creado por', key: 'createdBy' },
          { label: 'Tipo', key: 'type' }
        ]}
      />
    </View>
  )
}

export const CommentRow = ({
  comment,
  viewOrder,
  refetch
}: // orderId
{
  comment: FormattedComment
  viewOrder?: boolean
  refetch?: () => void
  // orderId: string
}) => {
  const { navigate } = useNavigation()
  const [disabled, setDisabled] = React.useState(false)
  const { staff } = useStore()

  const handleToggleSolveReport = async (commentId, solved) => {
    setDisabled(true)
    await ServiceComments.update(commentId, {
      solved: !solved
    })
      .then((res) => {
        console.log(res)
      })
      .catch((res) => console.error(res))
      .finally(() => {
        refetch?.()
        // setDisabled(false)
      })

    setTimeout(() => {
      setDisabled(false)
    }, 1000)
  }
  return (
    <View style={{ width: '100%', marginHorizontal: 'auto', maxWidth: 400 }}>
      <View style={{ justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={{ fontWeight: 'bold', marginRight: 4 }}>
            {staff?.find((s) => s?.userId === comment?.createdBy)?.name}
          </Text>
          <Text style={{ marginRight: 4 }}>{fromNow(comment?.createdAt)}</Text>
          {comment?.type === 'report' && (
            <Chip
              disabled={disabled}
              title={dictionary(comment?.type)}
              color={theme.error}
              titleColor={theme.neutral}
              size="xs"
            />
          )}

          <View style={{ marginLeft: 4 }}>
            <Button
              disabled={disabled}
              icon="done"
              color={comment?.solved ? 'success' : 'primary'}
              variant={comment?.solved ? 'filled' : 'ghost'}
              onPress={() =>
                handleToggleSolveReport(comment?.id, comment?.solved)
              }
              justIcon
              size="xs"
            />
          </View>
          {viewOrder && (
            <Chip
              title={`${comment?.orderFolio}  ${comment?.orderName}`}
              size="xs"
              color={theme.primary}
              onPress={() =>
                // @ts-ignore
                navigate('OrderDetails', { orderId: comment.orderId })
              }
            ></Chip>
          )}
        </View>
      </View>
      <Text
        style={[
          {
            width: '100%',
            textAlign: 'left',
            paddingVertical: 3
          },
          gStyles.helper
        ]}
      >
        {comment?.content}
      </Text>
    </View>
  )
}

export default ListComments
