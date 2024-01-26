import { ActivityIndicator, Linking, Pressable, View } from 'react-native'
import P from './P'
import Ionicons from '@expo/vector-icons/Ionicons'

import theme from '../theme'
import { useEffect, useState } from 'react'
import { ServiceUsers } from '../firebase/ServiceUser'
import CardPhone from './CardPhone'
import CardEmail from './CardEmail'
import UserType from '../types/UserType'
import H1 from './H1'
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
      <H1>{_user?.name}</H1>
      <CardPhone phone={_user?.phone} />
      <CardEmail email={_user?.email} />
    </View>
  )
}

export default CardUser
