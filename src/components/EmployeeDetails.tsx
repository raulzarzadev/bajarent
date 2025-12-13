import { ScrollView, Text, View } from 'react-native'
import dictionary from '../dictionary'
import { gStyles } from '../styles'
import theme from '../theme'
import type StaffType from '../types/StaffType'
import type StoreType from '../types/StoreType'
import Chip from './Chip'
import ErrorBoundary from './ErrorBoundary'

export const EmployeeDetails = (props: EmployeeDetailsProps) => {
  const { employee, shop } = props
  if (!employee) return null
  const sections = shop?.sections || []
  const assignedSections = employee.sectionsAssigned || []
  const assignedSectionsNames = sections
    .filter((s) => assignedSections.includes(s.id))
    .map((s) => s.name)

  const roles = employee.roles || {}
  const activeRoles = Object.entries(roles)
    .filter(([_, isActive]) => isActive)
    .map(([role]) => role)

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <Text style={gStyles.h2}>Detalles de Empleado</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={gStyles.helper}>staffId: {employee.id}</Text>
          <Text style={gStyles.helper}>userId: {employee.userId}</Text>
        </View>
        <Text style={gStyles.h1}>{employee.name}</Text>

        <View style={{ marginVertical: 8 }}>
          <Text style={gStyles.h3}>Contacto</Text>
          {!!employee.email && (
            <Text style={[gStyles.p, { textAlign: 'center' }]}>
              {employee.email}
            </Text>
          )}
          {!!employee.phone && (
            <Text style={[gStyles.p, { textAlign: 'center' }]}>
              {employee.phone}
            </Text>
          )}
        </View>

        <View style={{ marginVertical: 8 }}>
          <Text style={gStyles.h3}>Estado</Text>
          <View style={{ alignItems: 'center' }}>
            <Chip
              title={employee.disabled ? 'Deshabilitado' : 'Activo'}
              color={employee.disabled ? theme.error : theme.success}
              titleColor="white"
            />
          </View>
        </View>

        <View style={{ marginVertical: 8 }}>
          <Text style={gStyles.h3}>Roles</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {!activeRoles.length && (
              <Text style={gStyles.p}>Ningún rol asignado</Text>
            )}
            {activeRoles.map((role) => (
              <View key={role} style={{ margin: 4 }}>
                <Chip
                  title={dictionary(role as any) || role}
                  color={theme.primary}
                  titleColor="white"
                  size="sm"
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginVertical: 8 }}>
          <Text style={gStyles.h3}>Secciones Asignadas</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {!assignedSectionsNames.length && (
              <Text style={gStyles.p}>Ninguna sección asignada</Text>
            )}
            {assignedSectionsNames.map((sectionName) => (
              <View key={sectionName} style={{ margin: 4 }}>
                <Chip
                  title={sectionName}
                  color={theme.secondary}
                  titleColor="white"
                  size="sm"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export type EmployeeDetailsProps = {
  employee: Partial<StaffType>
  shop: StoreType
}
export const EmployeeDetailsE = (props: EmployeeDetailsProps) => (
  <ErrorBoundary componentName="EmployeeDetails">
    <EmployeeDetails {...props} />
  </ErrorBoundary>
)
