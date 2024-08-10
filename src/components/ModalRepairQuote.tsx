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
import { useOrderDetails } from '../contexts/orderContext'
import FormQuote from './FormQuote'
import ListOrderQuotes from './ListOrderQuotes'
import { onAddQuote, onRemoveQuote } from '../libs/order-actions'
import { OrderQuoteType } from '../types/OrderType'
import ButtonConfirm from './ButtonConfirm'

export const ModalRepairQuote = ({
  orderId
}: //quote
{
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
  const { order } = useOrderDetails()
  const quote = {
    info: order?.repairInfo || order?.quote?.description || '',
    total: order?.repairTotal || order?.quote?.amount || 0,
    brand: order?.itemBrand || '',
    serial: order?.itemSerial || '',
    category:
      order?.items?.[0]?.categoryName ||
      order?.item?.categoryName ||
      'Sin articulo',
    failDescription: order?.description || ''
  }
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

  const orderQuotes = (order?.quotes as OrderQuoteType[]) || []
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
          <ListOrderQuotes quotes={orderQuotes} />

          {quote.info ? (
            <Text style={[gStyles.p, gStyles.tCenter]}>{quote.info}</Text>
          ) : null}
          {quote.total ? (
            <Text style={[gStyles.p, gStyles.tCenter]}>
              <CurrencyAmount style={gStyles.tBold} amount={quote.total} />
            </Text>
          ) : null}
        </View>
        {quote?.info || quote?.total ? (
          <View style={{ justifyContent: 'center', margin: 'auto' }}>
            <ButtonConfirm
              justIcon
              handleConfirm={() => {
                return ServiceOrders.update(orderId, {
                  quote: null,
                  repairInfo: null,
                  repairTotal: null
                })
              }}
              text="IMPORTANTE. Asegurate de incluir esta cotización en la nueva lista de cotizaciones!"
              icon="delete"
              openColor="error"
              confirmColor="error"
              confirmVariant="outline"
              confirmLabel="Eliminar"
            ></ButtonConfirm>
          </View>
        ) : null}
      </View>

      <StyledModal {...modal}>
        <ListOrderQuotes
          quotes={orderQuotes}
          handleRemoveQuote={(id) => {
            const quote = orderQuotes.find((q) => q.id === id)
            onRemoveQuote({
              quote,
              orderId
            }).then((res) => {
              console.log({ res })
            })
          }}
        />
        <FormQuote
          onSubmit={(newQuote) => {
            console.log({ newQuote })
            onAddQuote({ newQuote, orderId }).then((res) => {
              console.log({ res })
            })
          }}
        />
        {/* <View style={styles.repairItemForm}>
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
        </View> */}
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
