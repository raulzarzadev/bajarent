import useAssignOrder from '../hooks/useAssignOrder'
import Chip from './Chip'
import theme from '../theme'
import { View } from 'react-native'

const OrderAssignedTo = ({ orderId }) => {
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
          style={{ margin: 2 }}
          title={assignedToSection?.toUpperCase()}
          color={theme.info}
          titleColor={theme.white}
        ></Chip>
      )}
      {assignedToStaff && (
        <Chip
          style={{ margin: 2 }}
          title={assignedToStaff?.toUpperCase()}
          color={theme.base}
          titleColor={theme.black}
        ></Chip>
      )}
    </View>
  )
}

export default OrderAssignedTo
