import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import { gStyles } from '../styles'
import type UserType from '../types/UserType'
import CardUser from './CardUser'
import { FormStaffE } from './FormStaff'

const ScreenStaffEdit = ({ route }) => {
  const { storeId } = useAuth()
  const { shop } = useShop()
  const shopStaff = shop?.staff || []
  const { staff } = useStore() // <--Buscar staff
  if (!staff?.length) return <ActivityIndicator />

  const staffId = route.params.staffId
  const employee = shopStaff?.find(({ id }) => id === staffId)
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <CardUser user={employee as UserType} />

        <FormStaffE
          defaultValues={employee}
          onSubmit={async (values) => {
            const [err, res] = await catchError(
              ServiceStores.updateStaff({
                staffId,
                storeId,
                staff: {
                  ...values
                }
              })
            )
            console.log({ err, res })
          }}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenStaffEdit
