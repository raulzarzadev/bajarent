import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StoreDetails, { ChangeStore } from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'
import Numbers from './Numbers'
import ErrorBoundary from './ErrorBoundary'

const ScreenStore = ({ navigation }) => {
  const { store, staffPermissions } = useStore()
  const { user } = useAuth()
  // const orderByStatus = (status) => {
  //   if (status === order_status.REPORTED)
  //     return orders?.filter((o) => o?.hasNotSolvedReports)?.length
  //   return orders?.filter((o) => o?.status === status)?.length
  // }
  const isOwner = store?.createdBy === user?.id

  return (
    <ScrollView>
      {!store && <ChangeStore label="Entrar " />}
      {isOwner && (
        <View
          style={{
            borderRadius: 9999,
            marginVertical: 16,
            backgroundColor: theme.success,
            width: 80,
            margin: 'auto',
            padding: 8
          }}
        >
          <Text
            style={{
              color: theme.white,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Dueño
          </Text>
        </View>
      )}
      {store && (
        <>
          <StoreDetails store={store} />
          {(staffPermissions?.isAdmin || isOwner) && (
            <>
              <View style={styles.buttonsContainer}>
                <Button
                  buttonStyles={styles.button}
                  onPress={() => {
                    navigation.navigate('Staff')
                  }}
                >
                  Staff
                </Button>
                <Button
                  buttonStyles={styles.button}
                  onPress={() => {
                    navigation.navigate('Areas')
                  }}
                >
                  Areas
                </Button>
                <Button
                  buttonStyles={styles.button}
                  onPress={() => {
                    navigation.navigate('Cashbox')
                  }}
                >
                  Caja
                </Button>
              </View>
              <View>
                <ErrorBoundary componentName="Numbers">
                  <Numbers />
                </ErrorBoundary>
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  )
}

export default ScreenStore

const styles = StyleSheet.create({
  button: {},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8
  },
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
