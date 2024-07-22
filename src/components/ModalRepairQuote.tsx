import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import InputTextStyled from './InputTextStyled'
import { useAuth } from '../contexts/authContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'
import theme from '../theme'

export const ModalRepairQuote = ({
  orderId,
  quote
}: {
  orderId: string
  quote?: {
    info: string
    total?: number
    failDescription?: string
    brand?: string
    model?: string
    serial?: string
    category?: string
  }
}) => {
  const quoteAlreadyExists = !quote || quote?.info || quote?.total
  const label = quoteAlreadyExists ? 'Modificar Cotización' : 'Cotización'

  const modal = useModal({ title: label })

  const { user } = useAuth()
  const [info, setInfo] = useState(quote?.info || '')
  const [total, setTotal] = useState(quote?.total || 0)
  const [saving, setSaving] = useState(false)

  const handleRepairFinished = async () => {
    setSaving(true)
    await ServiceOrders.update(orderId, {
      repairInfo: info,
      repairTotal: total,
      quoteBy: user.id
    })
      .then((r) => {
        console.log(r)
        modal.toggleOpen()
      })
      .catch(console.error)
  }

  return (
    <>
      <View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Text style={gStyles.h2}>Cotización </Text>
            <Button
              variant="ghost"
              size="small"
              justIcon
              icon="edit"
              color="success"
              onPress={modal.toggleOpen}
            />
          </View>
          <Text style={[gStyles.p, gStyles.tCenter]}>{quote.info}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            <CurrencyAmount style={gStyles.tBold} amount={quote.total} />
          </Text>
        </View>
      </View>

      <StyledModal {...modal}>
        <View style={styles.repairItemForm}>
          <InputTextStyled
            value={info}
            placeholder="Descripción de reparación"
            numberOfLines={3}
            multiline
            onChangeText={setInfo}
          ></InputTextStyled>
        </View>
        <View style={styles.repairItemForm}>
          <InputTextStyled
            type="number"
            value={total}
            keyboardType="numeric"
            placeholder="Total $ "
            onChangeText={(value) => {
              setTotal(parseFloat(value) || 0)
            }}
          ></InputTextStyled>
        </View>
        <View style={styles.repairItemForm}>
          <Button
            disabled={saving}
            onPress={handleRepairFinished}
            color="success"
          >
            {quoteAlreadyExists ? 'Guardar' : 'Editar'}
          </Button>
        </View>
      </StyledModal>
    </>
  )
}

export default ModalRepairQuote

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%' // spacing between items
  },
  repairItemForm: {
    marginVertical: 4
  }
})
