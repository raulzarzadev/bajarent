import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { CustomerType } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
import { CustomerContactsE } from './CustomerContacts'
import { CustomerImagesE } from './CustomerImages'
import { useEmployee } from '../../contexts/employeeContext'
import { ModalLocationE } from '../ModalLocation'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import CoordsType from '../../types/CoordsType'
import ButtonConfirm from '../ButtonConfirm'
import { useNavigation } from '@react-navigation/native'
import { getCoordinates } from '../../libs/maps'
import { useEffect, useState } from 'react'
const CustomerCard = (props?: CustomerCardProps) => {
  const navigation = useNavigation()
  const { update, remove } = useCustomers()
  const customer = props?.customer
  const { permissions } = useEmployee()
  const { toCustomers } = useMyNav()
  const customerId = customer?.id

  const canRead = customerId && permissions?.customers?.read
  const canEdit = customerId && permissions?.customers?.edit
  const canDelete = customerId && permissions?.customers?.delete

  if (!customer) return <Text>No hay cliente</Text>
  const handleUpdateLocation = async (location: CoordsType | string) => {
    return await update(customerId, {
      // @ts-ignore
      ['address.locationURL']: location
    })
  }
  const [customerLocation, setCustomerLocation] = useState<CoordsType>()
  useEffect(() => {
    getCoordinates(customer?.address?.locationURL).then((coords) => {
      setCustomerLocation(coords)
    })
  }, [customer.address.locationURL, customer.address.coords])

  return (
    <View style={{ justifyContent: 'center' }}>
      {/* CUSTOMER ACTIONS SHOULD VERIFY EMPLOYEE PERMISSIOS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          maxWidth: 700,
          minWidth: 400,
          marginVertical: 8,
          marginHorizontal: 'auto'
        }}
      >
        {/* ELIMINAR */}
        {canDelete && (
          <ButtonConfirm
            openLabel="Eliminar"
            icon="delete"
            handleConfirm={async () => {
              remove(customer.id)
              navigation.goBack()
            }}
            openColor="error"
            openVariant="ghost"
            openSize="xs"
            confirmColor="error"
            //justIcon
          >
            <Text style={{ textAlign: 'center', marginVertical: 12 }}>
              ¡ Eliminar de forma permanente !
            </Text>
          </ButtonConfirm>
        )}

        {/* EDITAR */}
        {canEdit && (
          <Button
            label="Editar"
            icon="edit"
            variant="ghost"
            size="xs"
            onPress={() => {
              toCustomers({ to: 'edit', id: customer.id })
            }}
          ></Button>
        )}
        {/* VER DETALLES */}
        {canRead && (
          <Button
            label="ver"
            icon="openEye"
            size="xs"
            color="secondary"
            variant="ghost"
            onPress={() => toCustomers({ to: 'details', id: customerId })}
          ></Button>
        )}
        {/* CREAR NUEVA ORDEN */}
        <Button
          label="Orden"
          icon="orderAdd"
          color="success"
          variant="ghost"
          size="xs"
          onPress={() => {
            toCustomers({ customerId: customer?.id, to: 'newOrder' })
          }}
        ></Button>
      </View>

      <Text style={gStyles.h2}>{customer?.name}</Text>
      <Text style={gStyles.h3}>Dirección</Text>
      <Text style={{ textAlign: 'center' }}>
        Colonia: {customer?.address?.neighborhood}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Calle: {customer?.address?.street}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Referencias: {customer?.address?.references}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginVertical: 8
        }}
      >
        <ModalLocationE
          coords={customerLocation}
          setCoords={(value) => {
            handleUpdateLocation(value)
          }}
        />
      </View>
      <CustomerContactsE
        customerId={customer.id}
        canAdd
        customerContacts={customer.contacts}
      />
      <CustomerImagesE
        images={customer?.images}
        customerId={customer?.id}
        canAdd
      />
    </View>
  )
}
export default CustomerCard
export type CustomerCardProps = {
  customer: Partial<CustomerType>
  canEdit?: boolean
}
export const CustomerCardE = (props: CustomerCardProps) => (
  <ErrorBoundary componentName="CustomerCard">
    <CustomerCard {...props} />
  </ErrorBoundary>
)
