import { Text, View } from 'react-native'
import dictionary from '../dictionary'
import { ServiceStores } from '../firebase/ServiceStore'
import { gStyles } from '../styles'
import theme from '../theme'
import type StaffType from '../types/StaffType'
import { staff_permissions } from '../types/StaffType'
import Button from './Button'
import Chip from './Chip'
import ErrorBoundary from './ErrorBoundary'

const StaffPermissions = ({
  staff,
  storeId
}: {
  staff: StaffType
  storeId: string
}) => {
  const permissions = Object.keys(staff_permissions)
  const allowedPermissions = permissions?.filter(
    (permission) => staff?.[permission]
  )

  if (allowedPermissions.length === 0) return null

  return (
    <View>
      <Text style={gStyles.h3}>
        Permisos antiguos{' '}
        <Button
          onPress={() => {
            console.log('Eliminar')
            ServiceStores.removeOldPermissions({ storeId, staffId: staff.id })
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

export const StaffPermissionsE = (props: {
  staff: StaffType
  storeId: string
}) => {
  return (
    <ErrorBoundary componentName="StaffPermissions">
      <StaffPermissions {...props} />
    </ErrorBoundary>
  )
}

export default StaffPermissions
