import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'
import theme from '../theme'
import P from './P'
import { fromNow } from '../libs/utils-date'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ServiceComments } from '../firebase/ServiceComments'
import Chip from './Chip'
import StyledTextInput from './StyledTextInput'
import { CheckBox } from 'react-native-elements'
import Button from './Button'

const OrderComments = ({ orderId }: { orderId: string }) => {
  const [comments, setComments] = useState<OrderType['comments']>([])
  useEffect(() => {
    ServiceComments.orderComments(orderId, setComments)
  }, [orderId])
  return (
    <View style={{ maxWidth: 400, marginHorizontal: 'auto' }}>
      <P bold>Comentarios</P>
      <InputComment orderId={orderId} />
      <View style={{ padding: theme.padding.sm }}>
        {comments?.map((comment, i) => (
          <OrderComment
            key={i}
            comment={comment}
            //orderId={orderId}
          />
        ))}
      </View>
    </View>
  )
}

const InputComment = ({ orderId }: { orderId: string }) => {
  const [content, setContent] = useState('')
  const [isReport, setIsReport] = useState(false)
  const handleToggleIsReport = () => setIsReport(!isReport)

  const reset = () => {
    setContent('')
    setIsReport(false)
  }
  const handleAddComment = async () => {
    await ServiceComments.create({
      orderId,
      content,
      type: isReport ? 'report' : 'comment'
    })
      .then((res) => reset())
      .catch((res) => console.error(res))
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
          styles={{ alignSelf: 'center' }}
          disabled={!content.length}
          onPress={handleAddComment}
        >
          Comentar
        </Button>
      </View>
    </View>
  )
}

const OrderComment = ({
  comment
}: // orderId
{
  comment: OrderType['comments'][number]
  // orderId: string
}) => {
  const handleToggleSolveReport = async (commentId, solved) => {
    await ServiceComments.update(commentId, {
      solved: !solved
    })
      .then((res) => console.log(res))
      .catch((res) => console.error(res))
  }
  return (
    <View style={{ width: '100%', marginHorizontal: 'auto' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <P styles={{ fontWeight: 'bold', marginRight: 4 }}>Raul Zarza</P>
          <P styles={{ fontSize: theme.font.size.md, marginRight: 4 }}>
            {fromNow(comment.createdAt)}
          </P>
          {comment?.type === 'report' && (
            <Chip
              title={dictionary(comment?.type)}
              color={theme.statusColor.REPORTED}
              titleColor={theme.colors.white}
              size="sm"
            />
          )}

          <Ionicons
            name="checkmark-done-circle"
            color={
              comment.solved ? theme.colors.success : theme.colors.lightgrey
            }
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
          paddingVertical: theme.padding.md
        }}
      >
        {comment?.content}
      </P>
    </View>
  )
}
export default OrderComments

const styles = StyleSheet.create({})
