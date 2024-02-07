import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ButtonIcon from './ButtonIcon'
import useFilter from '../hooks/useFilter'
import { useStore } from '../contexts/storeContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import OrderType, { order_status, order_type } from '../types/OrderType'
import Chip from './Chip'
import theme, { ORDER_TYPE_COLOR, STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { gStyles } from '../styles'

const ModalFilterOrders = ({
  orders,
  setOrders
}: {
  orders: OrderType[]
  setOrders: (orders: OrderType[]) => void
}) => {
  const { staff, storeSections } = useStore()
  const filterModal = useModal({ title: 'Filtrar por' })

  const { filterBy, cleanFilter, filteredData, filtersBy } = useFilter({
    data: orders
  })

  useEffect(() => {
    setOrders(filteredData)
  }, [filteredData])

  const isFilterSelected = (field, value) => {
    return filtersBy.some((a) => a.field === field && a.value === value)
  }

  return (
    <View>
      <View style={{ marginLeft: 8 }}>
        <ButtonIcon
          variant={!filtersBy?.length ? 'ghost' : 'filled'}
          color={!filtersBy?.length ? 'black' : 'primary'}
          icon="filter"
          onPress={() => {
            filterModal.toggleOpen()
          }}
        />
      </View>

      <StyledModal {...filterModal}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ textAlign: 'center' }}>
            {filteredData.length} ordenes
          </Text>
          {filtersBy?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ButtonIcon
                icon="broom"
                type="material-community"
                buttonStyles={{ margin: 8 }}
                variant="ghost"
                onPress={cleanFilter}
                color="secondary"
              ></ButtonIcon>
              <Text style={{ fontSize: 10 }}>Todas</Text>
            </View>
          )}
        </View>

        {/* ******** FILTER BY ORDER TYPE */}
        <Text style={[gStyles.h3]}>Por tipo</Text>
        <View style={styles.filters}>
          {[order_type.RENT, order_type.REPAIR].map((item, index) => (
            <Chip
              key={index}
              style={{
                margin: 4,
                borderWidth: 4,
                borderColor: isFilterSelected('type', item)
                  ? theme.black
                  : 'transparent'
              }}
              title={dictionary(item as order_type)?.toUpperCase() || ''}
              color={ORDER_TYPE_COLOR[item]}
              titleColor={theme.accent}
              onPress={() => {
                return filterBy('type', item)
              }}
            />
          ))}
        </View>
        {/* ******** FILTER BY STATUS  */}
        <Text style={[gStyles.h3]}>Por status</Text>
        <View style={styles.filters}>
          {Object.keys(order_status).map((item, index) => (
            <Chip
              key={index}
              style={{
                margin: 4,
                borderWidth: 4,
                borderColor: isFilterSelected('status', item)
                  ? theme.black
                  : 'transparent'
              }}
              title={dictionary(item as order_status)?.toUpperCase() || ''}
              color={STATUS_COLOR[item]}
              titleColor={theme.accent}
              disabled={item === 'REPORTED'}
              onPress={() => {
                if (item === 'REPORTED')
                  return filterBy('hasNotSolvedReports', true)
                filterBy('status', item)
              }}
            />
          ))}
        </View>
        {/* ******** FILTER BY ASSIGNED SECTIONS */}
        <Text style={[gStyles.h3]}>Asignada (Area)</Text>
        <View style={styles.filters}>
          {storeSections.map((item, index) => (
            <Chip
              key={index}
              style={{
                margin: 4,
                borderWidth: 4,
                borderColor: isFilterSelected('assignToSection', item.id)
                  ? theme.black
                  : 'transparent'
                // filteredBy === item.position ? theme.black : 'transparent'
              }}
              title={item?.name?.toUpperCase() || ''}
              color={theme.primary}
              titleColor={theme.accent}
              onPress={() => {
                filterBy('assignToSection', item.id)
              }}
            />
          ))}
        </View>
        {/* ******** FILTER BY ASSIGNED STAFF */}
        <Text style={[gStyles.h3]}>Asignada (Staff)</Text>
        <View style={styles.filters}>
          {staff.map((item, index) => (
            <Chip
              key={index}
              style={{
                margin: 4,
                borderWidth: 4,
                borderColor: isFilterSelected('assignToStaff', item.id)
                  ? theme.black
                  : 'transparent'
                // filteredBy === item.position ? theme.black : 'transparent'
              }}
              title={item?.position?.toUpperCase() || ''}
              color={theme.primary}
              titleColor={theme.accent}
              onPress={() => {
                filterBy('assignToStaff', item.id)
              }}
            />
          ))}
        </View>
      </StyledModal>
    </View>
  )
}

export default ModalFilterOrders

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }
})
