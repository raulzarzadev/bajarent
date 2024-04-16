import { Text, View } from 'react-native'
import StaffType from '../types/StaffType'
import Chip from './Chip'
import theme from '../theme'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'

const EmployeePermissions = ({ staff }: { staff: Partial<StaffType> }) => {
  const orderPermissions = staff?.permissions?.order || {}
  const storePermissions = staff?.permissions?.store || {}
  const orderPermissionsKeys = Object.keys(orderPermissions)
  const storePermissionsKeys = Object.keys(storePermissions)
  const isAdmin = staff?.permissions?.isAdmin

  const orderPermissionsAllowed = orderPermissionsKeys?.filter(
    (permission) => orderPermissions[permission]
  )
  const storePermissionsAllowed = storePermissionsKeys?.filter(
    (permission) => storePermissions[permission]
  )

  if (
    !isAdmin &&
    !orderPermissionsAllowed?.length &&
    !storePermissionsAllowed?.length
  ) {
    return <Text style={gStyles.p}>Este usuario no tiene permisos</Text>
  }

  return (
    <View style={{ maxWidth: 500, marginHorizontal: 'auto' }}>
      <Text style={gStyles.h3}>Permisos de empleado</Text>
      {isAdmin && (
        <Chip
          color={theme.secondary}
          titleColor="white"
          title={dictionary('isAdmin')}
        ></Chip>
      )}
      {!!orderPermissionsAllowed?.length && (
        <Text style={gStyles.h3}>Ordenes</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: 500,
          justifyContent: 'center'
        }}
      >
        {orderPermissionsAllowed?.map((permission) => (
          <View key={permission} style={{ margin: 4 }}>
            <Chip
              color={theme.info}
              titleColor="white"
              title={dictionary(permission)}
            ></Chip>
          </View>
        ))}
      </View>
      {!!storePermissionsAllowed?.length && (
        <Text style={gStyles.h3}>Store</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: 500,
          justifyContent: 'center'
        }}
      >
        {storePermissionsAllowed?.map((permission) => (
          <View key={permission} style={{ margin: 4 }}>
            <Chip
              color={theme.info}
              titleColor="white"
              title={dictionary(permission)}
            ></Chip>
          </View>
        ))}
      </View>
    </View>
  )
}
export const EmployeePermissionsE = (props: { staff: Partial<StaffType> }) => {
  return (
    <ErrorBoundary componentName="EmployeePermissions">
      <EmployeePermissions {...props} />
    </ErrorBoundary>
  )
}

export default EmployeePermissions
