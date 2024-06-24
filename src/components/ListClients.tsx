import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ListE } from './List'
import { ClientType } from '../types/ClientType'
import ListRow from './ListRow'
import { useNavigation } from '@react-navigation/native'

const ListClients = ({ clients }: { clients: ClientType[] }) => {
  const { navigate } = useNavigation()
  return (
    <View>
      <ListE
        rowsPerPage={20}
        sideButtons={[
          {
            icon: 'add',
            label: 'Nuevo Cliente',
            onPress: () => {
              //@ts-ignore
              navigate('StackClients', {
                screen: 'ScreenClientNew'
              })
            },
            visible: true
          }
        ]}
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
        onPressRow={(id) => {
          //@ts-ignore
          navigate('StackClients', {
            screen: 'ScreenClientDetails',
            params: {
              id
            }
          })
        }}
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
