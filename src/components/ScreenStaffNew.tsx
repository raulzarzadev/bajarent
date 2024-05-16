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
import theme, { colors } from '../theme'
import UserType from '../types/UserType'
import P from './P'
import CardUser from './CardUser'
import StaffType, { CreateStaffType } from '../types/StaffType'
import { gStyles } from '../styles'
import Loading from './Loading'
import ListStaff from './ListStaff2'
import { ServiceSections } from '../firebase/ServiceSections'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import TextInfo from './TextInfo'

const ScreenStaffNew = ({ route }) => {
  const { store, staff } = useStore()
  const staffNotInSection = staff.filter(
    (s) =>
      !s.sectionsAssigned?.length ||
      !s.sectionsAssigned.includes(route?.params?.sectionId)
  )
  const { goBack } = useNavigation()
  const [user, setUser] = React.useState<UserType>()
  const defaultValues: Partial<StaffType> = {
    userId: user?.id,
    position: user?.name,
    name: user?.name || ''
  }
  const sectionId = route?.params?.sectionId

  if (!store) return <Loading />
  if (sectionId) defaultValues.sectionsAssigned = [sectionId]
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={gStyles.container}>
        {!user && <SearchStaff setUser={setUser} />}
        {!!user && (
          <View>
            <CardUser user={user} />
            <Button
              label="Buscar otro"
              icon="search"
              variant="ghost"
              onPress={() => setUser(null)}
            />
          </View>
        )}

        {!!user && (
          <FormStaff
            defaultValues={defaultValues}
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
                goBack()
              })
            }}
          />
        )}
      </View>
      <View>
        {staffNotInSection?.length > 0 && (
          <>
            {sectionId ? (
              <Text style={gStyles.h3}>
                O agrega a una persona que ya es Staff{' '}
              </Text>
            ) : (
              <Text style={gStyles.h3}>Staff actual</Text>
            )}
            <ListStaff
              showNewStaff={false}
              staff={staffNotInSection}
              onPressRow={(staffId) => {
                ServiceSections.addStaff(sectionId, staffId).then(() => {
                  goBack()
                })
              }}
              handleAdd={
                sectionId
                  ? async (rowId) => {
                      await ServiceSections.addStaff(sectionId, rowId)
                        .then((res) => {
                          goBack()
                          console.log(res)
                        })
                        .catch((err) => console.log(err))
                    }
                  : undefined
              }
            />
          </>
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
  const { staff } = useStore()
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

  const alreadyIsStaff = (userId: string) => {
    return staff.some((s) => s.userId === userId)
  }

  return (
    <View style={{ maxWidth: 500, width: '100%', marginHorizontal: 'auto' }}>
      <TextInfo text="Para agregar un nuevo miembro al staff. Este debe estar previamente registrado" />
      <Text>Buscar usuario</Text>
      <InputTextStyled
        value={text}
        onChangeText={(text) => {
          setText(text)
          setLoading(true)
          setError(null)
        }}
        placeholder="Nombre, teléfono o email"
        // helperText="Usuario deberá estar previamente registrado"
      />
      {!!error && <P styles={{ color: theme.error }}>{error}</P>}

      <View style={{ padding: 4, justifyContent: 'center' }}>
        {!!loading && <ActivityIndicator />}
        {users.map((user) => {
          const isStaff = alreadyIsStaff(user.id)
          return (
            <Pressable
              disabled={isStaff}
              onPress={() => {
                setUser(user)
                setUsers([])
                setText('')
              }}
              key={user.id}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: isStaff ? colors.gray : theme.primary,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                opacity: isStaff ? 0.5 : 1
              }}
            >
              <Text>{user.name}</Text>
              <Text>{user.phone}</Text>
              <Text>{user.email}</Text>
              {isStaff && <Text>'Ya es parte de este equipo'</Text>}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export default ScreenStaffNew
