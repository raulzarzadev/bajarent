import { StyleSheet, Text, View } from 'react-native'
import Chip from './Chip'
import ButtonConfirm from './ButtonConfirm'
import theme from '../theme'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { ServiceComments } from '../firebase/ServiceComments'
import { useState } from 'react'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import { useOrdersCtx } from '../contexts/ordersContext'
import { FormattedComment } from '../types/CommentType'
import dictionary from '../dictionary'
import Button from './Button'
import { fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'

export const CommentRow = ({
  comment: _comment,
  viewOrder
}: // refetch
// orderId
{
  comment: FormattedComment
  viewOrder?: boolean
  refetch?: (props?: { id?: string }) => void
  // orderId: string
}) => {
  const { navigate } = useNavigation()
  const [disabled, setDisabled] = useState(false)
  const { staff } = useStore()
  const { user } = useAuth()

  const { consolidatedOrders } = useOrdersCtx()
  const orders = consolidatedOrders?.orders || {}
  const order = orders[_comment?.orderId]

  const [comment, setComment] = useState<FormattedComment>(_comment)

  const handleToggleSolveReport = async (commentId, solved) => {
    setDisabled(true)
    await ServiceComments.update(commentId, {
      solved: !solved,
      solvedAt: !solved ? new Date() : null,
      solvedBy: !solved ? user?.id : null
    })
      .then((res) => {
        // console.log(res)
      })
      .catch((res) => {
        //console.error(res)
      })

    await fetchComment()
    setDisabled(false)
  }
  const fetchComment = async () => {
    return await ServiceComments.get(_comment.id).then((res) => {
      setComment(res)
    })
  }

  const commentCreatedBy =
    staff.find((s) => s.userId === comment?.createdBy)?.name ||
    comment?.createdByName
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  const { toOrders } = useMyNav()

  if (!comment) return null

  return (
    <View
      style={{
        width: '100%',
        marginHorizontal: 'auto',
        // maxWidth: 500,
        marginBottom: 4
      }}
    >
      <View style={{ justifyContent: 'space-between' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}
        >
          <Text style={{ fontWeight: 'bold', marginRight: 4 }}>
            {commentCreatedBy}
          </Text>
          <View style={{ width: 55 }}>
            <Text style={[gStyles.helper]}>{fromNow(comment?.createdAt)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            {comment?.type === 'report' && (
              <View style={styles.badge}>
                <Chip
                  disabled={disabled}
                  title={dictionary(comment?.type)}
                  color={theme.error}
                  titleColor={theme.white}
                  size="xs"
                />
              </View>
            )}
            {comment?.type === 'important' && (
              <View style={styles.badge}>
                <Chip
                  disabled={disabled}
                  title={dictionary(comment?.type)}
                  color={theme.warning}
                  titleColor={theme.black}
                  size="xs"
                />
              </View>
            )}
            <View style={styles.badge}>
              <Button
                disabled={disabled}
                icon="done"
                color={comment?.solved ? 'success' : 'primary'}
                variant={comment?.solved ? 'filled' : 'outline'}
                onPress={() =>
                  handleToggleSolveReport(comment?.id, comment?.solved)
                }
                justIcon
                size="small"
              />
            </View>
            {!!order ? (
              <View style={styles.badge}>
                <Chip
                  title={`${order?.folio}  ${order?.fullName}`}
                  size="sm"
                  color={theme.primary}
                  titleColor={theme.white}
                  onPress={() => {
                    toOrders({ id: comment?.orderId })
                  }}
                ></Chip>
              </View>
            ) : (
              <View style={styles.badge}>
                <Chip
                  title={`ver orden`}
                  size="sm"
                  color={theme.primary}
                  titleColor={theme.white}
                  onPress={() => {
                    toOrders({ id: comment?.orderId })
                  }}
                ></Chip>
              </View>
            )}
            {!!(isAdmin || isOwner) && (
              <View style={styles.badge}>
                <ButtonConfirm
                  openColor="error"
                  openSize="xs"
                  justIcon
                  icon="delete"
                  confirmColor="error"
                  openVariant="ghost"
                  text="¿Estás seguro de eliminar este comentario?"
                  handleConfirm={async () => {
                    await ServiceComments.delete(comment?.id).then(() => {})
                    fetchComment()
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <Text
        style={[
          {
            width: '100%',
            textAlign: 'left',
            paddingVertical: 3
          }
        ]}
      >
        {comment?.content}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 6
  }
})