import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, { IconOrderType, order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import theme, { colors } from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import InputRadios from './InputRadios'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { currentRentPeriod } from '../libs/orders'

const OrderDirectives = ({
  order
}: {
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>
}) => {
  const { storeSections } = useStore()
  const assignedSectionLabel =
    order?.assignToSectionName ||
    storeSections.find(({ id }) => id === order?.assignToSection)?.name ||
    false
  const TypeIcon = (type: OrderType['type']) => {
    return dictionary(type) || type
    if (type === order_type.RENT) return '⏳'
    if (type === order_type.SALE) return '💰'
    if (type === order_type.REPAIR) return '🔧'
    return type
  }
  const orderType = `${TypeIcon(order.type)} ${currentRentPeriod(order, {
    shortLabel: true
  })}`
  return (
    <View
      style={{
        flexDirection: 'row',
        // //  justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <ChooseLabel colorLabel={order?.colorLabel} orderId={order?.id} />
      {/* {ICON ? <Text>{ICON}</Text> : null} */}
      <Chip
        style={[styles.chip]}
        title={orderType}
        color={theme?.info}
        titleColor={theme.black}
        size="sm"
      ></Chip>
      {!!assignedSectionLabel && (
        <Chip
          style={styles.chip}
          title={assignedSectionLabel}
          color={theme?.base}
          titleColor={theme.secondary}
          size="sm"
        ></Chip>
      )}

      <OrderStatus order={order} chipStyles={styles.chip} chipSize={'sm'} />
      {/* <OrderAssignedTo
        orderId={order?.id}
        chipStyles={styles.chip}
        chipSize={'sm'}
      /> */}
    </View>
  )
}

const ChooseLabel = ({ colorLabel, orderId }) => {
  const modal = useModal({ title: 'Seleccionar un color' })
  const colorsOptions = [
    { label: 'Rojo', value: colors.red, color: colors.red },
    { label: 'Azul', value: colors.blue, color: colors.blue },
    { label: 'Verde', value: colors.green, color: colors.green },
    { label: 'Amarillo', value: colors.yellow, color: colors.yellow },
    { label: 'sin', value: '' }
  ]
  useEffect(() => {
    setColor(colorLabel)
  }, [colorLabel])
  const [color, setColor] = useState(colorLabel)
  const handleSelectColor = async (color) => {
    setColor(color)
    modal.toggleOpen()
    await ServiceOrders.update(orderId, { colorLabel: color })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <View>
      <Chip
        style={[styles.chip, { marginLeft: 6 }]}
        title="🏷️"
        color={color}
        titleColor={theme.secondary}
        size="sm"
        onPress={modal.toggleOpen}
      ></Chip>

      <StyledModal {...modal}>
        <View>
          <InputRadios
            layout="row"
            options={colorsOptions}
            setValue={handleSelectColor}
            value={color}
          />
        </View>
      </StyledModal>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 2,
    maxWidth: 120
  }
})

export const OrderDirectivesE = (props) => (
  <ErrorBoundary componentName="OrderDirectives">
    <OrderDirectives {...props} />
  </ErrorBoundary>
)

export default OrderDirectives
