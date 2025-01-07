import { ScrollView, View } from 'react-native'
import { FormOrdersConfigE } from './FormOrdersConfig'
import { gStyles } from '../styles'
import { ServiceStores } from '../firebase/ServiceStore'
import Loading from './Loading'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'

const ScreenOrdersConfig = () => {
  const navigation = useNavigation()
  const handleSubmit = async (values) => {
    try {
      const res = await ServiceStores.update(store.id, values)
      console.log({ res })
      navigation.goBack()
      return res
    } catch (e) {
      console.error({ e })
    }
  }
  const { store } = useStore()
  const storeOrdersConfig = {
    orderTypes: store?.orderTypes || null,
    orderFields: store?.orderFields || null
  }

  if (!store) return <Loading />

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormOrdersConfigE
          onSubmit={handleSubmit}
          defaultValues={storeOrdersConfig}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenOrdersConfig
