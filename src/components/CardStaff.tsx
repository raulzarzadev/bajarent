import { Text, View } from 'react-native'
import UserType from '../types/UserType'
import StaffType, { staff_permissions } from '../types/StaffType'
import CardUser from './CardUser'
import H1 from './H1'
import Chip from './Chip'
import dictionary from '../dictionary'
import theme from '../theme'
import { gStyles } from '../styles'

// import Chip from './Chip'
// import dictionary from '../dictionary'

const CardStaff = ({
  staff,
  isOwner
}: {
  staff?: StaffType
  isOwner: boolean
}) => {
  const permissions = Object.keys(staff_permissions)
  // const { staffPermissions } = useStore()
  if (isOwner)
    return (
      <Text style={[gStyles.h3, { marginVertical: 12 }]}>
        Eres el dueño de esta tienda
      </Text>
    )
  if (!staff) return null
  return (
    <View
      style={{
        justifyContent: 'center',
        maxWidth: 500,
        width: '100%',
        marginHorizontal: 'auto'
      }}
    >
      <Text style={gStyles.h1}>Empleado</Text>
      <View>
        <Text style={{ textAlign: 'center' }}>Puesto: {staff?.position}</Text>
        <Text style={{ textAlign: 'center' }}>Id: {staff?.id}</Text>
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
              {permission && staff?.[permission] && (
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
