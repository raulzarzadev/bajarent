import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ServiceStoresClients } from '../firebase/ServiceStoreClients'
import { ClientType } from '../types/ClientType'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import ButtonConfirm from './ButtonConfirm'
import { gStyles } from '../styles'
import ImagePreview from './ImagePreview'
import ListRow from './ListRow'
import TextInfo from './TextInfo'
import { colors } from '../theme'

const ButtonCreateClient = ({
  client,
  storeId,
  orderId,
  clientId
}: {
  client: Partial<ClientType>
  storeId: string
  orderId: string
  clientId?: string
}) => {
  const { navigate } = useNavigation()

  const [clients, setClients] = React.useState<Partial<ClientType>[]>([])
  const [selectedClient, setSelectedClient] =
    React.useState<Partial<ClientType['id']>>(clientId)

  React.useEffect(() => {
    ServiceStoresClients.searchSimilarClients(storeId, client).then((res) => {
      setClients(res)
    })
  }, [])

  const handleUpdateOrderClient = (clientId) => {
    ServiceOrders.update(orderId, {
      clientId: clientId
    })
  }

  const handleCreateClient = () => {
    ServiceStoresClients.createStoreClient(storeId, {
      ...client
      //email: order.email
    })
      .then((res) => {
        setSelectedClient(res)
        handleUpdateOrderClient(res) //* <--- update order with client id
        //TODO? update order with client information
      })
      .catch((err) => {
        console.log({ err })
      })
  }

  const clientAlreadyExist = !!clientId
  const canCreateClient = !clientAlreadyExist
  const similarClientsExist = clients?.length > 0

  return (
    <View>
      {canCreateClient && (
        <ButtonConfirm
          modalTitle="Crear cliente"
          icon="profileAdd"
          justIcon
          openVariant="ghost"
          handleConfirm={async () => {
            selectedClient
              ? handleUpdateOrderClient(selectedClient)
              : handleCreateClient()
          }}
          confirmColor="success"
          confirmLabel={selectedClient ? 'Asociar cliente' : 'Crear cliente'}
        >
          {similarClientsExist && (
            <View>
              <Pressable
                onPress={() => {
                  setSelectedClient('')
                }}
                style={{
                  backgroundColor: !selectedClient
                    ? colors.lightBlue
                    : colors.transparent,
                  borderRadius: 8
                }}
              >
                <CardClient client={client} />
              </Pressable>
              <TextInfo
                defaultVisible
                type="warning"
                text="Hay clientes muy parecidos. Puedes crear un nuevo cliente o escojer alguno de la lista para asociarlo a esta orden."
              ></TextInfo>

              {similarClientsExist && (
                <ListOfSimilarClients
                  selectedClient={selectedClient}
                  clients={clients}
                  onPressRow={(id) => {
                    if (id) {
                      setSelectedClient(id)
                    } else {
                      setSelectedClient(id)
                    }
                    //  handleUpdateOrderClient(id)
                  }}
                />
              )}
            </View>
          )}
        </ButtonConfirm>
      )}
      {clientAlreadyExist && (
        <Button
          variant="ghost"
          justIcon
          icon="profile"
          onPress={() => {
            console.log('visit')
          }}
        />
      )}
    </View>
  )
}

const ListOfSimilarClients = ({
  clients,
  onPressRow,
  selectedClient
}: {
  clients: Partial<ClientType>[]
  onPressRow: (id: string) => void
  selectedClient?: string
}) => {
  return (
    <View>
      <ListRow
        fields={[
          {
            component: (
              <View>
                <Text>Nombre</Text>
              </View>
            ),
            width: 'rest'
          },
          {
            component: (
              <View>
                <Text>Telefono</Text>
              </View>
            ),
            width: 'rest'
          },
          {
            component: (
              <View>
                <Text>Colonia</Text>
              </View>
            ),
            width: 'rest'
          },
          {
            component: (
              <View>
                <Text>Dirección</Text>
              </View>
            ),
            width: 'rest'
          },
          {
            component: (
              <View>
                <Text>ID</Text>
              </View>
            ),
            width: 'rest'
          }
        ]}
      />
      {clients.map((client) => (
        <Pressable
          style={{ marginVertical: 4 }}
          key={client.id}
          onPress={() => onPressRow(client.id)}
        >
          <ListRow
            style={{
              backgroundColor:
                selectedClient && selectedClient === client.id
                  ? colors.lightBlue
                  : colors.transparent
            }}
            fields={[
              {
                component: (
                  <View>
                    <Text>{client?.name}</Text>
                  </View>
                ),
                width: 'rest'
              },
              {
                component: (
                  <View>
                    <Text>{client?.phone}</Text>
                  </View>
                ),
                width: 'rest'
              },
              {
                component: (
                  <View>
                    <Text>{client?.neighborhood}</Text>
                  </View>
                ),
                width: 'rest'
              },
              {
                component: (
                  <View>
                    <Text>{client?.address}</Text>
                  </View>
                ),
                width: 'rest'
              },
              {
                component: (
                  <View>
                    <ImagePreview image={client?.imageID} />
                  </View>
                ),
                width: 'rest'
              }
            ]}
          />
        </Pressable>
      ))}
    </View>
  )
}

export const CardClient = ({ client }: { client: Partial<ClientType> }) => {
  return (
    <View style={{ justifyContent: 'center', marginVertical: 6 }}>
      <Text style={[gStyles.h3]}>{client?.name}</Text>
      <Text style={[gStyles.tCenter]}>{client?.phone}</Text>
      <Text style={[gStyles.tCenter]}>{client?.address || ''}</Text>
      <Text style={[gStyles.tCenter]}>{client?.neighborhood || ''}</Text>

      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        {client?.imageID && <ImagePreview image={client?.imageID} />}
        {client?.imageHouse && <ImagePreview image={client?.imageHouse} />}
      </View>
    </View>
  )
}
export default ButtonCreateClient

const styles = StyleSheet.create({})
