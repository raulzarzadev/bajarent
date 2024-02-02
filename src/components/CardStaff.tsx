import { Text, View } from 'react-native'
import UserType from '../types/UserType'
import StaffType, { staff_permissions } from '../types/StaffType'
import CardUser from './CardUser'
import H1 from './H1'
import Chip from './Chip'
import dictionary from '../dictionary'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
// import Chip from './Chip'
// import dictionary from '../dictionary'

const CardStaff = ({ staff }: { staff?: StaffType }) => {
  const permissions = Object.keys(staff_permissions)
  // const { staffPermissions } = useStore()
  return (
    <View
      style={{
        justifyContent: 'center',
        maxWidth: 500,
        width: '100%',
        marginHorizontal: 'auto'
      }}
    >
      <CardUser user={staff as UserType} />
      <View>
        <Text style={{ textAlign: 'center' }}>Puesto: {staff?.position}</Text>
      </View>

      <View style={{ marginVertical: 16 }}>
        <H1>Permisos</H1>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
        >
          {permissions?.map((permission) => (
            <View key={permission} style={{ margin: 4 }}>
              {permission && staff[permission] && (
                <Chip
                  color={theme.secondary}
                  titleColor="white"
                  title={dictionary(permission as staff_permissions)}
                >
                  {permissions}
                </Chip>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default CardStaff
