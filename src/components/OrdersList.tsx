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
import theme, { STATUS_COLOR } from '../theme'
import Button from './Button'
import useFilter from '../hooks/useFilter'
import InputTextStyled from './InputTextStyled'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
  const { staff, staffPermissions } = useStore()
  const { filterBy, cleanFilter, filteredData, filteredBy, search } = useFilter(
    {
      data: orders
    }
  )
  const { sortBy, order, sortedBy, sortedData } = useSort({
    data: filteredData
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

  let timerId = null
  console.log({ staffPermissions })
  const handleDebounceSearch = (e: string) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      search(e)
    }, 300)
  }

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <InputTextStyled
            placeholder="Buscar..."
            onChangeText={(e) => {
              handleDebounceSearch(e)
            }}
          />
          <View style={{ marginLeft: 8 }}>
            <ButtonIcon
              variant={!filteredBy ? 'ghost' : 'filled'}
              color={!filteredBy ? 'black' : 'primary'}
              icon="filter-list"
              onPress={() => {
                filterModal.toggleOpen()
              }}
            />
          </View>

          <StyledModal {...filterModal}>
            <H1>Filtrar</H1>
            <P bold>Por status</P>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.keys(order_status).map((item, index) => (
                <Chip
                  key={index}
                  style={{
                    margin: 4,
                    borderWidth: 4,
                    borderColor:
                      filteredBy === item ? theme.black : 'transparent'
                  }}
                  title={dictionary(item as order_status).toUpperCase() || ''}
                  color={STATUS_COLOR[item]}
                  titleColor={theme.accent}
                  onPress={() => {
                    if (item === 'REPORTED')
                      return filterBy('hasNotSolvedReports', true)
                    filterBy('status', item)
                  }}
                />
              ))}
            </View>

            <P bold>Asignada a</P>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {staff.map((item, index) => (
                <Chip
                  key={index}
                  style={{
                    margin: 4,
                    borderWidth: 4,
                    borderColor:
                      filteredBy === item.position ? theme.black : 'transparent'
                  }}
                  title={item?.position?.toUpperCase() || ''}
                  color={theme.primary}
                  titleColor={theme.accent}
                  onPress={() => {
                    filterBy('assignToPosition', item.position)
                  }}
                />
              ))}
            </View>
            <View>
              <Text style={{ textAlign: 'center' }}>
                {filteredData.length} ordenes
              </Text>
            </View>
            <Button buttonStyles={{ marginTop: 16 }} onPress={cleanFilter}>
              Borrar filtros
            </Button>
          </StyledModal>
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>
            {filteredData.length} ordenes
          </Text>
        </View>
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
