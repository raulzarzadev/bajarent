import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StoreDetails, { ChangeStore } from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import { order_status } from '../types/OrderType'
import H1 from './H1'

const ScreenStore = ({ navigation }) => {
  const { store, staffPermissions, orders } = useStore()
  const orderByStatus = (status) => {
    if (status === order_status.REPORTED)
      return orders.filter((o) => o.hasNotSolvedReports).length
    return orders.filter((o) => o.status === status).length
  }
  return (
    <View>
      {!store && <ChangeStore label="Entrar " />}
      {store && (
        <>
          <StoreDetails store={store} />
          {staffPermissions?.isAdmin && (
            <>
              <View>
                <Button
                  buttonStyles={{
                    width: 100,
                    margin: 'auto',
                    marginVertical: 16
                  }}
                  onPress={() => {
                    navigation.navigate('Staff')
                  }}
                >
                  Staff
                </Button>
              </View>
              <View>
                <View>
                  <H1>Ordenes</H1>
                  <View style={{ justifyContent: 'center', margin: 'auto' }}>
                    <Text style={styles.label}>Folio actual </Text>
                    <Text style={styles.num}>{store.currentFolio}</Text>
                  </View>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Todas</Text>:
                    <Text style={styles.num}>{orders.length}</Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Pendientes</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.PENDING)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Autorizadas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.AUTHORIZED)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Entregadas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.DELIVERED)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Vencidas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.EXPIRED)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Renovadas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.RENEWED)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Recogidas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.PICKUP)}
                    </Text>
                  </Text>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Reportadas</Text>:{' '}
                    <Text style={styles.num}>
                      {orderByStatus(order_status.REPORTED)}
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  )
}

export default ScreenStore

const styles = StyleSheet.create({
  item: {
    width: '50%',
    margin: 'auto',
    marginVertical: 4
  },
  label: {
    width: 120,
    textAlign: 'center'
  },
  num: {
    width: 60,
    textAlign: 'center',
    margin: 'auto',
    fontWeight: 'bold'
  }
})
