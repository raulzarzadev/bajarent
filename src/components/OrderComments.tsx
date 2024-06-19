import { FlatList, View } from 'react-native'
import { useEffect, useState } from 'react'
import theme, { colors } from '../theme'
import P from './P'
import { ServiceComments } from '../firebase/ServiceComments'
import StyledTextInput from './InputTextStyled'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import InputCheckbox from './InputCheckbox'
import { gSpace } from '../styles'
import { CommentRow, CommentType } from './ListComments'
import { FormattedComment } from '../types/CommentType'
import formatComments from '../libs/formatComments'
import asDate from '../libs/utils-date'
import InputRadios from './InputRadios'

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
      <View style={{ padding: 0 }}>
        <FlatList
          data={orderComments.sort(
            (a, b) =>
              asDate(b.createdAt).getTime() - asDate(a.createdAt).getTime()
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentRow comment={item} refetch={getComments} />
          )}
        />
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
            marginRight: gSpace(2),
            flexDirection: 'row'
          }}
        >
          <InputRadios
            value={commentType}
            layout="row"
            setValue={(value) => {
              setCommentType(value)
            }}
            options={[
              {
                label: 'Importante',
                color: colors.yellow,
                value: 'important'
              },
              {
                label: 'Reporte',
                color: colors.red,
                value: 'report'
              }
            ]}
          />
          {/* <InputCheckbox
            label="Importante"
            setValue={handleToggleIsImportant}
            value={isImportant}
            color={theme.warning}
            style={{ justifyContent: 'flex-end', marginRight: 6 }}
          />
          <InputCheckbox
            label="Reporte"
            setValue={handleToggleIsReport}
            value={isReport}
            color={theme.error}
            style={{ justifyContent: 'flex-end' }}
          /> */}
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
