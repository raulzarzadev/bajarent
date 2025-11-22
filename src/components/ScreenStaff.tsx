import { ScrollView, Text, View } from 'react-native'
import { useState } from 'react'
import Button from './Button'
import ListStaff from './ListStaff2'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import Loading from './Loading'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useShop } from '../hooks/useShop'
import { ServiceStores } from '../firebase/ServiceStore'
import catchError from '../libs/catchError'
import { useAuth } from '../contexts/authContext'

const ScreenStaff = ({ navigation }) => {
  const { storeId } = useAuth()
  const { shop } = useShop()
  const shopStaff = shop?.staff || []
  const modal = useModal({ title: 'Eliminar empleado' })

  const [staffId, setStaffId] = useState('')
  const [disabled, setDisabled] = useState(false)
  if (!shop) return <Loading id="ScreenStaff" />
  const handleDeleteStaff = async () => {
    setDisabled(true)
    const [err, res] = await catchError(
      ServiceStores.removeStaff({
        storeId: storeId,
        staffId
      })
    )
    console.log({ err, res })
    //*TODO:   Remove after migration staff is completely removed from store
    await ServiceStaff.removeStaffFromStore(storeId, staffId)
      .then(console.log)
      .catch(console.log)
    modal.toggleOpen()
    setDisabled(false)
  }
  return (
    <ScrollView
      style={{
        width: '100%'
      }}
    >
      <View style={gStyles.container}>
        <ListStaff
          staff={shopStaff}
          handleSubtract={(staffId: string) => {
            setStaffId(staffId)
            modal.toggleOpen()
          }}
          handleEdit={
            //@ts-ignore
            (staffId: string) => {
              navigation.navigate('StackStaff', {
                screen: 'ScreenStaffEdit',
                params: { staffId }
              })
            }
          }

          // hideActions
        />
        <StyledModal {...modal}>
          <Text>Desea sacar a este empleado tienda? </Text>
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
    </ScrollView>
  )
}

export const ScreenStaffE = (props) => (
  <ErrorBoundary componentName="ScreenStaff">
    <ScreenStaff {...props} />
  </ErrorBoundary>
)

export default ScreenStaff
