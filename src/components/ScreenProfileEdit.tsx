import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import FormUser from './FormUser'
import { useAuth } from '../contexts/authContext'
import { ServiceUsers } from '../firebase/ServiceUser'
import ErrorBoundary from './ErrorBoundary'

const ScreenProfileEdit = ({ navigation }) => {
  const { user } = useAuth()
  if (!user) return <ActivityIndicator />
  return (
    <View>
      <FormUser
        defaultValues={user}
        onSubmit={async (values) => {
          ServiceUsers.update(user?.id, { ...values })
            .then((res) => {
              console.log(res)
              navigation.goBack()
            })
            .catch(console.error)
        }}
      />
    </View>
  )
}

export default function (props) {
  return (
    <ErrorBoundary componentName="ScreenProfileEdit" {...props}>
      <ScreenProfileEdit {...props} />
    </ErrorBoundary>
  )
}
