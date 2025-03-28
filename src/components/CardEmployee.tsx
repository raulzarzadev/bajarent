import { View, Text } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import BadgesStore from './BadgesStore'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import { staff_roles } from '../types/StaffType'
import Chip from './Chip'
import theme from '../theme'

const CardEmployee = () => {
  const { store, sections } = useStore()
  const { employee } = useEmployee()
  const { navigate } = useNavigation()
  console.log(employee?.roles)
  const staffRoles = Object.entries(employee?.roles || {}).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc.push(key)
      }
      return acc
    },
    []
  )

  return (
    <View>
      {store && (
        <>
          <View>
            <Button
              label={store?.name}
              variant="ghost"
              size="xs"
              icon="arrowForward"
              onPress={() => {
                //@ts-ignore
                navigate('Store', { storeId: store.id })
              }}
            ></Button>
          </View>
          {/* 
          -----> * SHOWS badges if is admin , owner 
          */}
          <BadgesStore />

          <Text style={[gStyles.helper, gStyles.tCenter]}>Puesto:</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{employee?.position}</Text>

          <Text style={[gStyles.helper, gStyles.tCenter]}>
            Areas asignadas:
          </Text>
          {!employee?.sectionsAssigned?.length && (
            <Text style={[gStyles.p, gStyles.tCenter]}>
              No estas asignado a ni un area
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {employee?.sectionsAssigned?.length &&
              employee?.sectionsAssigned.map((sectionId) => {
                const section = sections?.find((s) => s?.id === sectionId)
                return (
                  <Chip
                    size="sm"
                    title={section?.name}
                    color={theme.white}
                    titleColor={theme.secondary}
                    key={sectionId}
                  ></Chip>
                )
              })}
          </View>
          <Text style={[gStyles.helper, gStyles.tCenter]}>Roles:</Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {staffRoles.map((role) => {
              return (
                <Chip
                  size="sm"
                  color={theme.info}
                  title={staff_roles[role]}
                  key={role}
                  style={{ margin: 4 }}
                ></Chip>
              )
            })}
          </View>
        </>
      )}

      {/* {employee?.roles > 0 && (
        <>
          <Text style={gStyles.h3}>Roles</Text>
          {Object.entries(employee?.roles).map(([rol, value]) => {
            return (
              <Text style={[gStyles.p, gStyles.tCenter]}>
                {staff_roles[rol]} {value ? '✔️' : '❌'}
              </Text>
            )
          })}
        </>
      )} */}
    </View>
  )
}
export const CardEmployeeE = (props) => {
  return (
    <ErrorBoundary componentName="CardEmployee">
      <CardEmployee {...props} />
    </ErrorBoundary>
  )
}

export default CardEmployee
