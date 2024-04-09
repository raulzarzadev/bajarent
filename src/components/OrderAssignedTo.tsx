import useAssignOrder from '../hooks/useAssignOrder'
import Chip, { Size } from './Chip'
import theme from '../theme'
import { View, ViewStyle } from 'react-native'

const OrderAssignedTo = ({
  orderId,
  chipStyles,
  chipSize
}: {
  orderId: string
  chipStyles?: ViewStyle
  chipSize?: Size
}) => {
  const { assignedToSection, assignedToStaff } = useAssignOrder({
    orderId
  })

  return (
    <View
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {assignedToSection && (
        <Chip
          style={[chipStyles]}
          title={assignedToSection?.toUpperCase()}
          color={theme.info}
          titleColor={theme.white}
          size={chipSize}
        ></Chip>
      )}
      {assignedToStaff && (
        <Chip
          style={[chipStyles]}
          title={assignedToStaff?.toUpperCase()}
          color={theme.base}
          titleColor={theme.black}
          size={chipSize}
        ></Chip>
      )}
    </View>
  )
}

export default OrderAssignedTo
