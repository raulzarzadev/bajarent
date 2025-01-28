import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { ClientType } from '../types/ClientType'
import { useNavigation } from '@react-navigation/native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import ButtonConfirm from './ButtonConfirm'
import ImagePreview from './ImagePreview'
import ListRow from './ListRow'
import TextInfo from './TextInfo'
import { colors } from '../theme'
import CardClient from './CardClient'

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
  const [clients, setClients] = React.useState<Partial<ClientType>[]>([])
  const [selectedClient, setSelectedClient] =
    React.useState<Partial<ClientType['id']>>(clientId)

  const handleUpdateOrderClient = (clientId) => {
    ServiceOrders.update(orderId, {
      clientId: clientId
    })
  }

  const handleCreateClient = () => {
    ServiceStoreClients.add({
      storeId,
      client
    }).then(({ res }) => {
      setSelectedClient(res.id)
      handleUpdateOrderClient(res.id) //* <--- update order with client id
      //TODO? update order with client information
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
          onOpen={() => {
            ServiceStoreClients.getSimilar(storeId, client).then((res) => {
              setClients(res)
            })
          }}
          handleConfirm={async () => {
            selectedClient
              ? handleUpdateOrderClient(selectedClient)
              : handleCreateClient()
          }}
          confirmColor="success"
          confirmLabel={selectedClient ? 'Asociar cliente' : 'Crear cliente'}
        >
          <View style={{ marginVertical: 8 }}>
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

            {similarClientsExist && (
              <View>
                <TextInfo
                  defaultVisible
                  type="warning"
                  text="Hay clientes muy parecidos. Puedes crear un nuevo cliente o escojer alguno de la lista para asociarlo a esta orden."
                ></TextInfo>
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
              </View>
            )}
          </View>
        </ButtonConfirm>
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

export default ButtonCreateClient

const styles = StyleSheet.create({})
