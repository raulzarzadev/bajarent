import { Text, View } from 'react-native'
import { Chip } from 'react-native-elements'
import { useState } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import useModal from '../hooks/useModal'
import useMyNav from '../hooks/useMyNav'
import catchError from '../libs/catchError'
import theme from '../theme'
import type StaffType from '../types/StaffType'
import type StoreType from '../types/StoreType'
import Button from './Button'
import InputDisabledStaff from './InputDisabledStaff'
import { ListE } from './List'
import ListRow, { type ListRowField } from './ListRow'
import Loading from './Loading'
import StyledModal from './StyledModal'

const ListStaff = ({
  staff = [],
  shop,
  sectionId,
  onPressRow,
  showNewStaff = true,
  hideSearchAndFilters = false
}: {
  staff: StaffType[]
  shop?: StoreType
  sectionId?: string
  onPressRow?: (itemId: string) => void
  showNewStaff?: boolean
  handleEdit?: (rowId: string) => void
  hideSearchAndFilters?: boolean
}) => {
  const { toStaff } = useMyNav()
  const {
    permissions: { canEditStaff }
  } = useEmployee()
  if (shop === undefined) return <Loading id="staff details" />
  if (shop === null) return <Text>La tienda no existe</Text>
  const disableAdd = !canEditStaff
  return (
    <View>
      <ListE
        hideSearchAndFilters={hideSearchAndFilters}
        id="list-staff"
        sortFields={[
          { key: 'name', label: 'Nombre' },
          { key: 'disabled', label: 'Habilitado' }
        ]}
        ComponentRow={({ item }) => <StaffRow staff={item} shop={shop} />}
        data={staff}
        onPressRow={(itemId) => {
          console.log({ itemId })
          toStaff?.({
            to: 'edit',
            id: itemId
          })
          onPressRow?.(itemId)
        }}
        filters={[]}
        sideButtons={[
          {
            icon: 'add',
            onPress: () => {
              toStaff({ to: 'add', sectionId })
            },
            label: 'Add',
            visible: !!showNewStaff,
            disabled: disableAdd
          }
        ]}
      />
    </View>
  )
}

const StaffRow = ({
  staff,
  shop,
  handleAdd
}: {
  staff: Partial<StaffType>
  shop: StoreType
  handleAdd?: (rowId: string) => void
}) => {
  const {
    permissions: { canEditStaff, isAdmin, isOwner }
  } = useEmployee()

  const [staffId, setStaffId] = useState('')
  const [disabled, setDisabled] = useState(false)
  const { toStaff } = useMyNav()

  const modal = useModal({ title: 'Eliminar empleado' })
  const employeeCanEditStaff = canEditStaff || isAdmin || isOwner

  const handleDeleteStaff = async () => {
    setDisabled(true)
    const [err, res] = await catchError(
      ServiceStores.removeStaff({
        storeId: shop.id,
        staffId
      })
    )
    console.log({ err, res })

    modal.toggleOpen()
    setDisabled(false)
  }

  const isStaffOwner = staff?.permissions?.isOwner || staff?.roles?.admin

  const fields: ListRowField[] = [
    {
      component: (
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {staff?.name}
          </Text>
          {!!staff?.position && (
            <Text style={{ fontSize: 12, color: '#666' }}>
              {staff?.position}
            </Text>
          )}
          {!!staff?.email && (
            <Text style={{ fontSize: 10, color: '#999' }}>{staff?.email}</Text>
          )}
        </View>
      ),
      width: '40%'
    },
    {
      component: (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 16
          }}
        >
          <InputDisabledStaff staffId={staff?.id} />
          {isStaffOwner && (
            <Chip
              title="Admin"
              buttonStyle={{
                backgroundColor: theme.primary,
                paddingVertical: 2,
                paddingHorizontal: 4
              }}
              titleStyle={{ fontSize: 10 }}
            />
          )}
          <Button
            size="small"
            icon="edit"
            justIcon
            variant="ghost"
            onPress={() => {
              toStaff?.({
                to: 'edit',
                id: staff?.id
              })
            }}
            disabled={disabled || !employeeCanEditStaff}
          />

          <Button
            size="small"
            icon="delete"
            color="error"
            justIcon
            variant="ghost"
            onPress={() => {
              setStaffId(staff?.id)
              modal.toggleOpen()
            }}
            disabled={disabled || !employeeCanEditStaff}
          />
          {handleAdd && (
            <Button
              size="small"
              icon="add"
              color="info"
              justIcon
              variant="ghost"
              onPress={() => {
                handleAdd?.(staff?.id)
              }}
              disabled={disabled}
            />
          )}

          <StyledModal {...modal}>
            <Text>¿Desea eliminar a este empleado de la tienda?</Text>
            <Button
              onPress={() => {
                handleDeleteStaff()
              }}
              disabled={disabled}
              label="Eliminar"
              icon="delete"
              color="error"
              buttonStyles={{
                width: 140,
                margin: 'auto',
                marginVertical: 10
              }}
            />
          </StyledModal>
        </View>
      ),
      width: 'rest'
    }
  ]
  return <ListRow fields={fields} style={{ marginVertical: 2 }} />
}

export default ListStaff
