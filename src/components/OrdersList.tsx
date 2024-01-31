import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import OrderRow from './OrderRow'
import OrderType, { order_status } from '../types/OrderType'
import useSort from '../hooks/useSort'
import { Icon } from 'react-native-elements'
import ButtonIcon from './ButtonIcon'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import P from './P'
import H1 from './H1'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import Chip from './Chip'
import theme from '../theme'
import Button from './Button'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
  const { staff } = useStore()
  const { sortBy, order, sortedBy, sortedData, filterBy, cleanFilter } =
    useSort({
      data: orders
    })

  const sortFields = [
    { key: 'folio', label: 'Folio' },
    { key: 'firstName', label: 'Nombre' },
    // { key: 'lastName', label: 'Apellido' },
    { key: 'assignToPosition', label: 'Asignada' },
    { key: 'createdAt', label: 'Creada' },
    { key: 'scheduledAt', label: 'Programada' },
    { key: 'status', label: 'Estado' }
  ]

  const filterModal = useModal({ title: 'Filtrar por' })

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            alignItems: 'center'
          }}
        >
          {sortFields.map((field) => (
            <View key={field.key}>
              <Pressable
                onPress={() => {
                  sortBy(field.key)
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    fontWeight: sortedBy === field.key ? 'bold' : 'normal'
                  }}
                >
                  {field.label}
                </Text>
                {sortedBy === field.key && (
                  <Icon
                    name={order === 'asc' ? 'chevron-up' : 'chevron-down'}
                    type="font-awesome"
                    size={12}
                    color="black"
                  />
                )}
              </Pressable>
            </View>
          ))}
          <View>
            <ButtonIcon
              variant="ghost"
              color="black"
              icon="filter-list"
              onPress={() => {
                filterModal.toggleOpen()
              }}
            />
            <StyledModal {...filterModal}>
              <H1>Filtrar</H1>
              <P bold>Por status</P>
              <FlatList
                numColumns={4}
                data={Object.keys(order_status) as order_status[]}
                renderItem={({ item }) => {
                  return (
                    <Chip
                      style={{ margin: 4 }}
                      title={dictionary(item).toUpperCase() || ''}
                      color={theme.primary}
                      titleColor={theme.accent}
                      onPress={() => {
                        filterBy('status', item)
                        console.log('filter by status', item)
                      }}
                    ></Chip>
                  )
                }}
                keyExtractor={(item) => item}
              ></FlatList>

              <P bold>Asignada a</P>
              <FlatList
                horizontal
                data={staff}
                renderItem={({ item }) => {
                  return (
                    <Chip
                      style={{ margin: 4 }}
                      title={item?.position?.toUpperCase() || ''}
                      color={theme.primary}
                      titleColor={theme.accent}
                      onPress={() => {
                        filterBy('assignToPosition', item.position)
                      }}
                    ></Chip>
                  )
                }}
              ></FlatList>
              <Button buttonStyles={{ marginTop: 16 }} onPress={cleanFilter}>
                Borrar filtros
              </Button>
            </StyledModal>
          </View>
        </View>
        <FlatList
          style={styles.orderList}
          data={sortedData}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPressRow && onPressRow(item.id)
              }}
            >
              <OrderRow order={item} />
            </Pressable>
          )}
        ></FlatList>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%',
    // paddingVertical: 40,
    paddingHorizontal: 4
  }
})

export default OrdersList
