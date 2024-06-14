import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, { IconOrderType } from '../types/OrderType'
import dictionary from '../dictionary'
import theme, { colors } from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import Icon from './Icon'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import InputRadios from './InputRadios'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'

const OrderDirectives = ({
  order
}: {
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>
}) => {
  const { storeSections } = useStore()
  const sectionName = storeSections?.find(
    ({ id }) => id === order?.assignToSection
  )?.name
  const ICON = IconOrderType[order?.type]
  return (
    <View
      style={{
        flexDirection: 'row',
        // //  justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <ChooseLabel colorLabel={order.colorLabel} orderId={order.id} />
      {/* {ICON ? <Text>{ICON}</Text> : null} */}
      <Chip
        style={[styles.chip]}
        title={`${dictionary(order?.type)?.toUpperCase()}`}
        color={theme?.info}
        titleColor={theme.black}
        size="sm"
      ></Chip>
      {!!sectionName && (
        <Chip
          style={styles.chip}
          title={sectionName}
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
    maxWidth: 105
  }
})

export const OrderDirectivesE = (props) => (
  <ErrorBoundary componentName="OrderDirectives">
    <OrderDirectives {...props} />
  </ErrorBoundary>
)

export default OrderDirectives
