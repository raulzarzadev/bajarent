import { Text, View } from 'react-native'
import StaffType, { staff_permissions } from '../types/StaffType'
import Chip from './Chip'
import theme from '../theme'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import Button from './Button'
import { ServiceStaff } from '../firebase/ServiceStaff'

const StaffPermissions = ({ staff }: { staff: StaffType }) => {
  const permissions = Object.keys(staff_permissions)
  const allowedPermissions = permissions.filter(
    (permission) => staff?.[permission]
  )
  console.log({ allowedPermissions })
  if (allowedPermissions.length === 0) return null

  return (
    <View>
      <Text style={gStyles.h3}>
        Permisos antiguos{' '}
        <Button
          onPress={() => {
            console.log('Eliminar')
            ServiceStaff.deleteOldPermissions(staff.id)
          }}
          icon="delete"
          justIcon
          color="error"
          size="small"
          variant="ghost"
        ></Button>
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 500
        }}
      >
        {allowedPermissions?.map((permission) => (
          <View key={permission} style={{ margin: 4 }}>
            <Chip
              color={theme.secondary}
              titleColor="white"
              title={dictionary(permission as staff_permissions)}
            ></Chip>
          </View>
        ))}
      </View>
    </View>
  )
}

export const StaffPermissionsE = (props: { staff: StaffType }) => {
  return (
    <ErrorBoundary componentName="StaffPermissions">
      <StaffPermissions {...props} />
    </ErrorBoundary>
  )
}

export default Permissions
