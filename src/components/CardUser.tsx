import { ActivityIndicator, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ServiceUsers } from '../firebase/ServiceUser'
import CardPhone from './CardPhone'
import CardEmail from './CardEmail'
import UserType from '../types/UserType'
import H1 from './H1'
import { gStyles } from '../styles'
const CardUser = ({ userId, user }: { userId?: string; user?: UserType }) => {
  const [_user, _setUser] = useState(user)
  useEffect(() => {
    _setUser(user)
    if (userId && !user)
      ServiceUsers.get(userId).then((res) => {
        _setUser(res)
      })
  }, [user, userId])
  if (!_user) return <ActivityIndicator />
  return (
    <View style={{ justifyContent: 'center' }}>
      <Text style={gStyles.h1}>usuario</Text>
      <Text style={gStyles.h2}>{_user?.name}</Text>
      <CardPhone phone={_user?.phone} />
      <CardEmail email={_user?.email} />
      {__DEV__ && (
        <Text
          style={[
            { textAlign: 'center', marginHorizontal: 'auto' },
            gStyles.helper
          ]}
        >
          Id : {_user.id}
        </Text>
      )}
    </View>
  )
}

export default CardUser
