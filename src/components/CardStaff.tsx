import { Text, View } from 'react-native'
import UserType from '../types/UserType'
import StaffType from '../types/StaffType'
import CardUser from './CardUser'

const CardStaff = ({ staff }: { staff?: StaffType }) => {
  console.log({ staff })
  return (
    <View style={{ justifyContent: 'center' }}>
      <CardUser user={staff as UserType} />
      <View>
        <Text style={{ textAlign: 'center' }}>Puesto: {staff?.position}</Text>
      </View>
    </View>
  )
}

export default CardStaff
