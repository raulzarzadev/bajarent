import { Text, View } from 'react-native'
import UserType from '../types/UserType'
import StaffType from '../types/StaffType'
import CardUser from './CardUser'
import H1 from './H1'

const CardStaff = ({ staff }: { staff?: StaffType }) => {
  return (
    <View style={{ justifyContent: 'center' }}>
      <CardUser user={staff as UserType} />
      <View>
        <Text style={{ textAlign: 'center' }}>Puesto: {staff?.position}</Text>
      </View>

      <View>
        <H1>Permisos</H1>
        {staff?.isAdmin && (
          <Text style={{ textAlign: 'center' }}>Administrador</Text>
        )}
      </View>
    </View>
  )
}

export default CardStaff
