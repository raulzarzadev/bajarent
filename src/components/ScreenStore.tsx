import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import StoreDetails from './StoreDetails'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'
import Numbers from './Numbers'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import { useNavigation } from '@react-navigation/native'
import { ButtonAskLocation } from './LocationStatus'

const ScreenStore = ({ navigation }) => {
  const { navigate } = useNavigation()
  const { store, staffPermissions } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id

  return (
    <ScrollView>
      {!store && (
        <Text style={[gStyles.h3, { marginVertical: 16 }]}>
          Selecciona o crea una tienda en tu{' '}
          <Pressable
            onPress={() => {
              // @ts-ignore
              navigate('Profile')
            }}
          >
            <Text
              style={{
                color: theme.secondary
              }}
            >
              Perfil
            </Text>
          </Pressable>
        </Text>
      )}
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
          <ButtonAskLocation />
          <StoreDetails store={store} />
          <View style={{ justifyContent: 'center' }}></View>
          {(staffPermissions?.isAdmin || isOwner) && (
            <>
              <View style={styles.buttonsContainer}>
                <Button
                  buttonStyles={styles.button}
                  onPress={() => {
                    navigation.navigate('Items')
                  }}
                >
                  Artículos
                </Button>
                <Button
                  buttonStyles={styles.button}
                  onPress={() => {
                    navigation.navigate('Cashbox')
                  }}
                >
                  Caja
                </Button>
                {store.allowSections && (
                  <Button
                    buttonStyles={styles.button}
                    onPress={() => {
                      navigation.navigate('Areas')
                    }}
                  >
                    Areas
                  </Button>
                )}

                {store.allowStaff && (
                  <Button
                    buttonStyles={styles.button}
                    onPress={() => {
                      navigation.navigate('Staff')
                    }}
                  >
                    Staff
                  </Button>
                )}
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
  button: {
    marginVertical: 8
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
    flexWrap: 'wrap'
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
