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
import { FormattedComment } from '../types/CommentType'
import { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'
import InputCheckbox from './Inputs/InputCheckbox'
import Button from './Button'
import { useShop } from '../hooks/useShop'

const LINES_DEFAULT = 1

export const CommentRow = ({
  comment: _comment,
  showOrder = false
}: {
  comment: FormattedComment
  showOrder?: boolean
  refetch?: (props?: { id?: string }) => void
}) => {
  const { toItems, toOrders } = useMyNav()
  const [disabled, setDisabled] = useState(false)
  const { user } = useAuth()
  const { shop } = useShop()
  const staffShop = shop?.staff || []

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
  const staffInfo = staffShop?.find((s) => s.userId === comment?.createdBy)
  const commentCreatedBy = staffInfo?.name || 'SN'

  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()

  const [numberOfLines, setNumberOfLines] = useState(LINES_DEFAULT)

  if (!comment) return null

  const itsLargerThanDefault = comment?.content.length > 40
  const itsUnsolvedReport = comment.type === 'report' && !comment.solved

  return (
    <View
      style={{
        width: '100%',
        marginHorizontal: 'auto',
        marginTop: 4
        // maxWidth: 500,
        //marginBottom:
      }}
    >
      <View
        style={{
          backgroundColor: itsUnsolvedReport
            ? theme.errorLight
            : theme.infoLight,
          padding: 4,
          borderRadius: 8
        }}
      >
        {/* *************** COMMENT CONTENT  ************** */}
        <View>
          <View>
            <Text style={[gStyles.tBold]}>{commentCreatedBy}</Text>{' '}
          </View>
          <View>
            <Text numberOfLines={numberOfLines}>{comment?.content} </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {itsLargerThanDefault && numberOfLines === LINES_DEFAULT && (
            <Pressable onPress={() => setNumberOfLines(99)}>
              <Text style={[{ color: theme.primary }]}>ver mas</Text>
            </Pressable>
          )}
          {itsLargerThanDefault && numberOfLines !== LINES_DEFAULT && (
            <Pressable onPress={() => setNumberOfLines(LINES_DEFAULT)}>
              <Text style={[{ color: theme.primary }]}>ocultar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* *************** COMMENT metadata  ************** */}
      <View style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
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

          <View style={{ marginRight: 4 }}>
            <Text style={[gStyles.helper]}>
              <Text style={[gStyles.helper, { marginRight: 4 }]}>
                {dateFormat(comment?.createdAt, 'dd/MM HH:mm')}
              </Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
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
            {showOrder && comment?.orderId && (
              <View style={{ marginHorizontal: 6 }}>
                <Button
                  icon="openEye"
                  justIcon
                  variant="ghost"
                  size="xs"
                  onPress={() => {
                    toOrders({ id: comment?.orderId })
                  }}
                />
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
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 1
  }
})
