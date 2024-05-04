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
import { gSpace, gStyles } from '../styles'
import { useNavigation } from '@react-navigation/native'
import List from './List'
import { FormattedComment } from '../types/CommentType'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Icon from './Icon'

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
  refetch?: (props?: { id?: string; count?: number }) => void
}) => {
  const modal = useModal()
  return (
    <View style={[{ width: '100%' }, style]}>
      <StyledModal {...modal}>
        <Text style={{ textAlign: 'center' }}>Descarga más comentarios</Text>
        <Text style={gStyles.helper}>
          Se descargan en orden, comenzando por los ultimos.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            margin: 'auto',
            marginVertical: gSpace(2)
          }}
        >
          <Button
            label="10"
            onPress={() => refetch({ count: 10 })}
            size="small"
          />
          <Button
            label="20"
            onPress={() => refetch({ count: 20 })}
            size="small"
          />
          <Button
            label="40"
            onPress={() => refetch({ count: 40 })}
            size="small"
          />
          <Button
            label="80"
            onPress={() => refetch({ count: 80 })}
            size="small"
          />
        </View>
        <Text style={gStyles.helper}>
          <Icon icon="info" color={theme.info} size={22} />
          Esto ahorra datos y tiempos de carga. Estamos buscando alternativas
          para omitir esto en el futuro.{' '}
        </Text>
      </StyledModal>
      <View
        style={{
          marginVertical: gSpace(1),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={[
            gStyles.helper,
            {
              textAlign: 'center'
            }
          ]}
        >
          Solo se descargan los ultimos 10 commentarios. Para descargar más
          pulsa <Icon icon="download" size={15} />
        </Text>
      </View>
      <List
        sideButtons={[
          {
            icon: 'download',
            label: '',
            onPress: modal.toggleOpen,
            visible: true
          }
        ]}
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
          { field: 'type', label: 'Tipo' },
          { field: 'solved', label: 'Resuelto', boolean: true },
          { field: 'createdByName', label: 'Creado por' }
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
  refetch?: (props?: { id?: string }) => void
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
        // console.log(res)
      })
      .catch((res) => {
        //console.error(res)
      })
      .finally(() => {
        refetch?.({ id: commentId })
        // setDisabled(false)
      })

    // setTimeout(() => {
    //   setDisabled(false) //* <--- this is not aplaying because look like all list is re-rendering after refetch
    // }, 6000)
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

          <View style={{ marginHorizontal: 4 }}>
            <Button
              disabled={disabled}
              icon="done"
              color={comment?.solved ? 'success' : 'primary'}
              variant={comment?.solved ? 'filled' : 'outline'}
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
