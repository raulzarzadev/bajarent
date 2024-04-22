import { Text, View, ViewStyle, StyleSheet } from 'react-native'
import StaffType from '../types/StaffType'
import { dateFormat } from '../libs/utils-date'
import theme from '../theme'
import { gStyles } from '../styles'
import { ServiceSections } from '../firebase/ServiceSections'
import { useNavigation } from '@react-navigation/native'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import { useAuth } from '../contexts/authContext'

export type StaffRowProps = {
  staffId: StaffType['id']
  sectionId?: string
  fields?: (keyof StaffType)[]
  style?: ViewStyle
  selected?: boolean
  hideActions?: boolean
}
const Row = ({
  staffId,
  sectionId,
  fields = ['name', 'position'],
  style,
  selected,
  hideActions
}: StaffRowProps) => {
  const navigation = useNavigation()
  const {
    store: { staff }
  } = useAuth()
  const staffItem = staff.find((s) => s.id === staffId)
  const text = (field?: string | Date): string => {
    if (typeof field === 'string') return field
    if (field instanceof Date) {
      return dateFormat(field)
    }
  }
  const modal = useModal({ title: 'Acciones' })
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 4,
          backgroundColor: theme.primary,
          padding: 4,
          paddingHorizontal: 8,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: selected ? theme.secondary : 'transparent'
        },
        style
      ]}
    >
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center'
        }}
      >
        {fields?.map((field) => (
          <Text
            key={field}
            style={{
              marginHorizontal: 4,
              width: `${100 / fields?.length + 1}%`,
              textAlignVertical: 'center'
            }}
            numberOfLines={1}
          >
            {text(staffItem?.[field] as string)}
          </Text>
        ))}
        {!hideActions && (
          <View>
            <Button
              onPress={modal.toggleOpen}
              icon="verticalDots"
              justIcon
            ></Button>
            <StyledModal {...modal}>
              <View style={styles.modalContainer}>
                {!staffItem && (
                  <Text style={gStyles.h3}>Staff no encontrado</Text>
                )}
                {!!staffItem && (
                  <>
                    <View style={styles.button}>
                      <Button
                        label="Editar"
                        onPress={() => {
                          modal.setOpen(false)
                          // @ts-ignore
                          navigation.navigate('StaffEdit', { staffId })
                        }}
                      ></Button>
                    </View>
                    <View style={styles.button}>
                      <Button
                        label="Ver detalles"
                        onPress={() => {
                          modal.setOpen(false)
                          // @ts-ignore
                          navigation.navigate('StaffDetails', {
                            staffId
                          })
                        }}
                      ></Button>
                    </View>
                  </>
                )}

                {!!sectionId && (
                  <View style={styles.button}>
                    <Button
                      label="Sacar de sección"
                      onPress={() => {
                        ServiceSections.removeStaff(sectionId, staffId).then(
                          () => {
                            modal.setOpen(false)
                          }
                        )
                      }}
                    ></Button>
                  </View>
                )}
              </View>
            </StyledModal>
          </View>
        )}
      </View>
    </View>
  )
}

export default function StaffRow(props: StaffRowProps) {
  return (
    <ErrorBoundary componentName="StaffRow">
      <Row {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  modalContainer: {},
  button: {
    marginVertical: 8
  }
})
