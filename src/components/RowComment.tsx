import { Pressable, StyleSheet, Text, View } from 'react-native'
import Chip from './Chip'
import ButtonConfirm from './ButtonConfirm'
import theme from '../theme'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { ServiceComments } from '../firebase/ServiceComments'
import { useState } from 'react'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'
import { FormattedComment } from '../types/CommentType'
import { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'
import InputCheckbox from './Inputs/InputCheckbox'

export const CommentRow = ({
  comment: _comment,
  showOrder = false
}: // refetch
// orderId
{
  comment: FormattedComment
  showOrder?: boolean
  refetch?: (props?: { id?: string }) => void
}) => {
  const { toOrders, toItems } = useMyNav()
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
  const staffInfo = staff?.find((s) => s.userId === comment?.createdBy)
  const commentCreatedBy = staffInfo?.position || staffInfo?.name

  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  const LINES_DEFAULT = 1
  const [numberOfLines, setNumberOfLines] = useState(LINES_DEFAULT)

  if (!comment) return null

  return (
    <View
      style={{
        width: '100%',
        marginHorizontal: 'auto'
        // maxWidth: 500,
        //marginBottom:
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
          {comment.type === 'report' && (
            <InputCheckbox
              value={!comment?.solved}
              color={comment?.solved ? theme.success : theme.error}
              iconCheck={'siren'}
              disabled={disabled}
              variant="ghost"
              setValue={() => {
                handleToggleSolveReport(comment?.id, comment?.solved)
              }}
            />
          )}
          {comment.type === 'important' && (
            <InputCheckbox
              variant="ghost"
              value={!comment?.solved}
              color={comment?.solved ? theme.success : theme.warning}
              iconCheck={'warning'}
              disabled={disabled}
              setValue={() => {
                handleToggleSolveReport(comment?.id, comment?.solved)
              }}
            />
          )}
          <Text style={{ fontWeight: 'bold', marginRight: 4 }}>
            {commentCreatedBy}
          </Text>
          <View style={{ marginRight: 4 }}>
            <Text style={[gStyles.helper]}>
              <Text style={[gStyles.helper, { marginRight: 4 }]}>
                {dateFormat(comment?.createdAt, 'dd/MM HH:mm')}
              </Text>
              {fromNow(comment?.createdAt)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            {showOrder && !!order && (
              <View style={styles.badge}>
                <Chip
                  title={`${order?.folio}  ${order?.fullName}`}
                  size="sm"
                  color={theme.primary}
                  titleColor={theme.white}
                  onPress={() => {
                    toOrders({ id: comment?.orderId })
                  }}
                  maxWidth={120}
                ></Chip>
              </View>
            )}
            {showOrder && !order && !!comment?.orderId && (
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

            {!!comment?.itemId && (
              <View style={styles.badge}>
                <Chip
                  title={`ver item`}
                  size="sm"
                  color={theme.primary}
                  titleColor={theme.white}
                  onPress={() => {
                    toItems({ id: comment?.itemId })
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
            textAlign: 'left'
          },
          gStyles.helper
        ]}
        numberOfLines={numberOfLines}
      >
        {comment?.content}{' '}
      </Text>
      {comment?.content.length > 40 && numberOfLines === LINES_DEFAULT && (
        <Pressable onPress={() => setNumberOfLines(99)}>
          <Text style={[{ color: theme.primary, fontWeight: 'bold' }]}>
            ver
          </Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 1
  }
})
