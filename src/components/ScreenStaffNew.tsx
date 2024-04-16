import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native'
import React, { useEffect } from 'react'
import FormStaff from './FormStaff'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useStore } from '../contexts/storeContext'
import InputTextStyled from './InputTextStyled'
import { ServiceUsers } from '../firebase/ServiceUser'
import useDebounce from '../hooks/useDebunce'
import theme from '../theme'
import UserType from '../types/UserType'
import P from './P'
import CardUser from './CardUser'
import { useStoreNavigation } from './StackStore'
import { CreateStaffType } from '../types/StaffType'
import { gStyles } from '../styles'

const ScreenStaffNew = () => {
  const { store } = useStore()
  const { navigate } = useStoreNavigation()
  const [user, setUser] = React.useState<UserType>()

  console.log({ user })

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={gStyles.container}>
        {!user && <SearchStaff setUser={setUser} />}
        {!!user && <CardUser user={user} />}
        {!!user && (
          <FormStaff
            defaultValues={{
              userId: user.id,
              position: user.name,
              name: user.name || ''
            }}
            onSubmit={async (values) => {
              const newStaff: CreateStaffType = {
                // name: user.name || '',

                ...values,
                position: values.position || '',
                storeId: store.id,
                userId: user.id || ''
              }
              ServiceStaff.addStaffToStore(store?.id, newStaff).then((res) => {
                setUser(undefined)
                navigate('Staff')
              })
            }}
          />
        )}
      </View>
    </ScrollView>
  )
}

const SearchStaff = ({ setUser }: { setUser?: (user: UserType) => any }) => {
  const [text, setText] = React.useState('')
  const [error, setError] = React.useState<string | null>('')
  const [loading, setLoading] = React.useState(false)
  const debouncedSearchTerm = useDebounce(text, 800)
  const [users, setUsers] = React.useState([])
  useEffect(() => {
    if (debouncedSearchTerm) {
      ServiceUsers.searchUser(debouncedSearchTerm)
        .then((res) => {
          if (!res.length) {
            setError(
              'Usuario no encontrado, asegurate que esta registrado sus datos son correctos'
            )
          } else {
            setUsers(res)
            setError(null)
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false)
        })
    }
  }, [debouncedSearchTerm])
  return (
    <View style={{ maxWidth: 500, width: '100%', marginHorizontal: 'auto' }}>
      <InputTextStyled
        value={text}
        onChangeText={(text) => {
          setText(text)
          setLoading(true)
          setError(null)
        }}
        placeholder="Nombre, teléfono o email"
        helperText="Usuario deberá estar previamente registrado"
      />
      {!!error && <P styles={{ color: theme.error }}>{error}</P>}

      <View style={{ padding: 4, justifyContent: 'center' }}>
        {!!loading && <ActivityIndicator />}
        {users.map((user) => (
          <Pressable
            onPress={() => {
              setUser(user)
              setUsers([])
              setText('')
            }}
            key={user.id}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: theme.primary,
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <Text>{user.name}</Text>
            <Text>{user.phone}</Text>
            <Text>{user.email}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default ScreenStaffNew
