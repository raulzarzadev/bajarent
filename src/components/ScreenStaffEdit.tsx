import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import { FormStaffE } from './FormStaff'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import CardUser from './CardUser'
import InputCheckbox from './InputCheckbox'
import { ServiceSections } from '../firebase/ServiceSections'
import { gStyles } from '../styles'

const ScreenStaffEdit = ({ route, navigation }) => {
  const { staff, store } = useStore()
  const [loading, setLoading] = React.useState(false)

  if (!staff.length) return <ActivityIndicator />

  const staffId = route.params.staffId
  const employee = staff?.find(({ id }) => id === staffId)
  const storeSections = store?.sections || []

  const handleUpdateEmployeeSections = async ({
    sectionId,
    add
  }: {
    sectionId: string
    add: boolean
  }) => {
    setLoading(true)
    try {
      if (add) {
        const res = await ServiceSections.addStaff(sectionId, employee.id)
      } else {
        const res = await ServiceSections.removeStaff(sectionId, employee.id)
      }

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <CardUser userId={employee.userId} />
        {/* <EmployeePermissionsE staff={employee} /> */}
        <Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
          Areas asignadas
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {storeSections?.map(({ name, staff, id }) => (
            <InputCheckbox
              key={id}
              disabled={loading}
              label={name}
              setValue={(checked) => {
                handleUpdateEmployeeSections({ sectionId: id, add: checked })
              }}
              value={staff?.includes(employee?.id) || false}
            />
          ))}
        </View>
        <FormStaffE
          defaultValues={employee}
          onSubmit={async (values) => {
            ServiceStaff.update(staffId, values)
              .then((res) => {
                console.log(res)
                navigation.goBack()
              })
              .catch(console.error)
          }}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenStaffEdit

const styles = StyleSheet.create({})
