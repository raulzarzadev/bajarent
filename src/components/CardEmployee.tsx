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
import { BadgeListSectionsE } from './BadgeListSections'

const CardEmployee = () => {
  const { store } = useStore()
  const { employee } = useEmployee()
  const { navigate } = useNavigation()
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
          <EmployeeSections />
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
    </View>
  )
}

export const EmployeeSections = ({
  onPressSection,
  selectedSection
}: {
  onPressSection?: ({ sectionId }: { sectionId: string }) => void
  selectedSection?: string | null
}) => {
  const { employee } = useEmployee()
  const { sections } = useStore()
  return (
    <>
      <Text style={[gStyles.helper, gStyles.tCenter]}>Areas asignadas:</Text>
      {!employee?.sectionsAssigned?.length && (
        <Text style={[gStyles.p, gStyles.tCenter]}>
          No estas asignado a ni un area
        </Text>
      )}
      <BadgeListSectionsE
        sections={sections}
        selectedSection={selectedSection}
        onPressSection={onPressSection}
      />
    </>
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
