import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'
import theme from '../theme'
import P from './P'
import asDate, { fromNow } from '../libs/utils-date'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ServiceComments } from '../firebase/ServiceComments'
import Chip from './Chip'
import StyledTextInput from './InputTextStyled'
import { CheckBox } from 'react-native-elements'
import Button from './Button'
import { useStore } from '../contexts/storeContext'

const OrderComments = ({ orderId }: { orderId: string }) => {
  const [orderComments, setOrderComments] = useState<OrderType['comments']>([])
  useEffect(() => {
    getComments()
  }, [])

  const getComments = () => {
    ServiceComments.getByOrder(orderId).then(setOrderComments)
  }

  const sortByDate = (a, b) =>
    asDate(b.createdAt).getTime() - asDate(a.createdAt).getTime()
  return (
    <View style={{ maxWidth: 400, marginHorizontal: 'auto', width: '100%' }}>
      <P bold>Comentarios</P>
      <InputComment orderId={orderId} updateComments={getComments} />
      <View style={{ padding: 6 }}>
        {orderComments?.sort(sortByDate)?.map((comment, i) => (
          <OrderComment
            key={i}
            comment={comment}
            updateComments={getComments}
          />
        ))}
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
  const [isReport, setIsReport] = useState(false)
  const [saving, setSaving] = useState(false)
  const { storeId } = useStore()
  const handleToggleIsReport = () => setIsReport(!isReport)

  const reset = () => {
    setContent('')
    setIsReport(false)
  }
  const handleAddComment = async () => {
    setSaving(true)
    await ServiceComments.create({
      orderId,
      storeId,
      content,
      type: isReport ? 'report' : 'comment'
    })
      .then((res) => {
        reset()
        updateComments()
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
        <CheckBox
          title="Reporte"
          checked={isReport}
          onPress={() => handleToggleIsReport()}
          containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
        />
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

const OrderComment = ({
  comment,
  updateComments
}: // orderId
{
  comment: OrderType['comments'][number]
  updateComments: () => void
  // orderId: string
}) => {
  const { staff } = useStore()
  const handleToggleSolveReport = async (commentId, solved) => {
    await ServiceComments.update(commentId, {
      solved: !solved
    })
      .then((res) => {
        updateComments()
        console.log(res)
      })
      .catch((res) => console.error(res))
  }
  return (
    <View style={{ width: '100%', marginHorizontal: 'auto' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <P styles={{ fontWeight: 'bold', marginRight: 4 }}>
            {staff?.find((s) => s?.userId === comment?.createdBy)?.name}
          </P>
          <P styles={{ marginRight: 4 }}>{fromNow(comment.createdAt)}</P>
          {comment?.type === 'report' && (
            <Chip
              title={dictionary(comment?.type)}
              color={theme.error}
              titleColor={theme.neutral}
              size="sm"
            />
          )}

          <Ionicons
            name="checkmark-done-circle"
            color={comment.solved ? theme.success : theme.accent}
            style={{ alignItems: 'baseline' }}
            onPress={() => handleToggleSolveReport(comment.id, comment.solved)}
            size={30}
          />
        </View>
      </View>
      <P
        styles={{
          width: '100%',
          textAlign: 'left',
          paddingVertical: 6
        }}
      >
        {comment?.content}
      </P>
    </View>
  )
}
export default OrderComments

const styles = StyleSheet.create({})
