import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import FormStaff from './FormStaff'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import InputTextStyled from './InputTextStyled'
import { ServiceUsers } from '../firebase/ServiceUser'
import useDebounce from '../hooks/useDebunce'
import theme from '../theme'
import UserType from '../types/UserType'
import P from './P'
import CardUser from './CardUser'

const ScreenStaffNew = () => {
  const { store } = useStore()
  const { navigate } = useNavigation()
  const [user, setUser] = React.useState<UserType>()
  return (
    <View style={{ padding: 10 }}>
      <P size="sm" styles={{ textAlign: 'left', opacity: 0.7 }}>
        {`Ten en cuenta que el usuario debera estar previamente registrado`}
      </P>
      <SearchStaff setUser={setUser} />
      {user && <CardUser user={user} />}
      {user && (
        <FormStaff
          defaultValues={{
            userId: user.id,
            position: ''
          }}
          onSubmit={async (values) => {
            const newStaff = {
              //name: user.name || '',
              position: values.position || '',
              storeId: store.id,
              userId: user.id || ''
            }
            ServiceStaff.create(newStaff).then((res) => {
              navigate('Staff')
            })
          }}
        />
      )}
      {/* <FormStaff
        onSubmit={async (values) => {
          console.log('onSubmit', values)
          values.storeId = store.id
          ServiceStaff.create(values).then((res) => {
            console.log(res)
            navigate('Staff')
          })
        }}
      /> */}
    </View>
  )
}

const SearchStaff = ({ setUser }: { setUser?: (user: UserType) => any }) => {
  const [text, setText] = React.useState('')
  const debouncedSearchTerm = useDebounce(text, 800)
  const [users, setUsers] = React.useState([])
  useEffect(() => {
    if (debouncedSearchTerm) {
      ServiceUsers.searchUser(debouncedSearchTerm)
        .then((res) => {
          setUsers(res)
        })
        .catch(console.error)
    }
  }, [debouncedSearchTerm])
  return (
    <View>
      <InputTextStyled
        value={text}
        onChangeText={setText}
        placeholder="Nombre, teléfono o email"
      />

      <View style={{ padding: 4 }}>
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

const styles = StyleSheet.create({})
