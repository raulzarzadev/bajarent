import useAssignOrder from '../hooks/useAssignOrder'
import Chip from './Chip'
import theme from '../theme'
import { View, ViewStyle } from 'react-native'

const OrderAssignedTo = ({
  orderId,
  chipStyles
}: {
  orderId: string
  chipStyles?: ViewStyle
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
        ></Chip>
      )}
      {assignedToStaff && (
        <Chip
          style={[chipStyles]}
          title={assignedToStaff?.toUpperCase()}
          color={theme.base}
          titleColor={theme.black}
        ></Chip>
      )}
    </View>
  )
}

export default OrderAssignedTo
