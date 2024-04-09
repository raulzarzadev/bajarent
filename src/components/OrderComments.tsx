import { View } from 'react-native'
import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import theme from '../theme'
import P from './P'
import { ServiceComments } from '../firebase/ServiceComments'
import StyledTextInput from './InputTextStyled'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import InputCheckbox from './InputCheckbox'
import { gSpace } from '../styles'
import ListComments from './ListComments'
import { FormattedComment } from '../types/CommentType'
import formatComments from '../libs/formatComments'

const OrderComments = ({ orderId }: { orderId: string }) => {
  const { orders, staff } = useStore()
  const getComments = async () => {
    const comments = await ServiceComments.getByOrder(orderId)
    const formattedComments: FormattedComment[] = formatComments({
      comments,
      staff,
      orders
    })
    setOrderComments(formattedComments)
  }
  const [orderComments, setOrderComments] = useState([])
  useEffect(() => {
    if (orderId) getComments()
  }, [orderId])
  return (
    <View style={{ maxWidth: 400, marginHorizontal: 'auto', width: '100%' }}>
      <P bold>Comentarios</P>
      <InputComment orderId={orderId} updateComments={getComments} />
      <View style={{ padding: 6 }}>
        <ListComments comments={orderComments} refetch={getComments} />
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: gSpace(2)
          }}
        >
          <InputCheckbox
            label="Reporte"
            setValue={handleToggleIsReport}
            value={isReport}
            color={theme.error}
            style={{ justifyContent: 'flex-end' }}
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
