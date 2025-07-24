import { FlatList, View } from 'react-native'
import { useEffect, useState } from 'react'
import { colors } from '../theme'
import P from './P'
import { ServiceComments } from '../firebase/ServiceComments'
import StyledTextInput from './InputTextStyled'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import { gSpace } from '../styles'
import { CommentType } from './ListComments'
import { FormattedComment } from '../types/CommentType'
import asDate from '../libs/utils-date'
import { CommentRow } from './RowComment'
import InputRadios from './Inputs/InputRadios'
import { useOrderDetails } from '../contexts/orderContext'

const OrderComments = ({ orderId }: { orderId: string }) => {
  const { order, setCommentsCount, commentsCount } = useOrderDetails()
  const sentMessagesAsComments: FormattedComment[] =
    order?.sentMessages?.map((m, i) => {
      return {
        content: `mensaje enviado: ${m.message}`,
        createdAt: m.sentAt,
        type: 'comment',
        createdBy: m.sentBy,
        id: `${i}`,
        orderId: orderId,
        storeId: order.storeId
      }
    }) || []
  const orderComments = order?.comments || []

  const [reportsAndImportantUnsolved, setReportsAndImportantUnsolved] =
    useState<CommentType[]>([])
  useEffect(() => {
    ServiceComments.getReportsAndImportantUnsolvedByOrder(orderId).then(
      (res) => {
        setReportsAndImportantUnsolved(res)
      }
    )
  }, [orderId])

  const comments = [
    ...reportsAndImportantUnsolved,
    ...orderComments,
    ...sentMessagesAsComments
  ].sort((a, b) => {
    // Put reports and important unsolved at the top
    const aIsReportOrImportant = a.type === 'report' || a.type === 'important'
    const bIsReportOrImportant = b.type === 'report' || b.type === 'important'

    if (aIsReportOrImportant && !bIsReportOrImportant) return -1
    if (!aIsReportOrImportant && bIsReportOrImportant) return 1

    // If both are same priority, sort by date
    return asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime()
  })

  return (
    <View style={{ maxWidth: 400, marginHorizontal: 'auto', width: '100%' }}>
      <P bold>Comentarios</P>
      <InputComment orderId={orderId} />
      <View style={{ padding: 0 }}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CommentRow comment={item} />}
        />
        <Button
          size="xs"
          buttonStyles={{ margin: 'auto', marginBottom: 12 }}
          fullWidth={false}
          label="mostrar más"
          disabled={orderComments.length < commentsCount}
          onPress={() => {
            setCommentsCount(commentsCount + 5)
          }}
          variant="ghost"
        ></Button>
      </View>
    </View>
  )
}

const InputComment = ({
  orderId,
  updateComments
}: {
  orderId: string
  updateComments?: () => void
}) => {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const { storeId } = useStore()
  const [commentType, setCommentType] = useState<CommentType['type']>('comment')
  const reset = () => {
    setContent('')
    setCommentType('comment')
  }
  const handleAddComment = async () => {
    setSaving(true)

    await ServiceComments.create({
      orderId,
      storeId,
      content,
      type: commentType
    })
      .then((res) => {
        reset()
        updateComments?.()
      })
      .catch((res) => console.error(res))
      .finally(() => setSaving(false))
  }
  return (
    <View>
      <StyledTextInput
        value={content}
        style={{
          marginBottom: 0,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0
        }}
        placeholder="Agrega un comentario"
        onChangeText={(text) => setContent(text)}
      ></StyledTextInput>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-end'
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginRight: gSpace(2),
            flexDirection: 'row',
            flex: 1
          }}
        >
          <InputRadios
            onChange={(value) => {
              setCommentType(value)
            }}
            options={[
              {
                label: 'Normal',
                color: colors.blue,
                value: 'comment',
                iconCheck: 'comment'
              },
              {
                label: 'Imp',
                color: colors.yellow,
                value: 'important',
                iconCheck: 'warning'
              },
              {
                label: 'Reporte',
                color: colors.red,
                value: 'report',
                iconCheck: 'report'
              }
            ]}
          />
        </View>

        <Button
          buttonStyles={{ alignSelf: 'center' }}
          disabled={!content.length || saving}
          onPress={handleAddComment}
        >
          Comentar
        </Button>
      </View>
    </View>
  )
}

export default OrderComments
