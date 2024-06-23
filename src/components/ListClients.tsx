import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ListE } from './List'
import { ClientType } from '../types/ClientType'
import ListRow from './ListRow'

const ListClients = ({ clients }: { clients: ClientType[] }) => {
  return (
    <View>
      <ListE
        defaultOrder="asc"
        defaultSortBy="name"
        sortFields={[
          {
            key: 'name',
            label: 'Nombre'
          },
          {
            key: 'phone',
            label: 'Telefono'
          },
          {
            key: 'neighborhood',
            label: 'Colonia'
          },
          {
            key: 'address',
            label: 'Dirección'
          },
          {
            key: 'status',
            label: 'Estatus'
          }
        ]}
        filters={[]}
        data={clients.map((client) => ({
          ...client,
          key: client.id,
          status: client.isActive ? 'Activo' : 'Inactivo'
        }))}
        ComponentRow={({ item }) => <RowClient client={item} />}
      />
    </View>
  )
}
const RowClient = ({ client }: { client: ClientType }) => {
  return (
    <ListRow
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
              <Text>{client?.status}</Text>
            </View>
          ),
          width: 'rest'
        }
      ]}
    />
  )
}

export default ListClients

const styles = StyleSheet.create({})
