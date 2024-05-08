import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import OrderType from '../types/OrderType'
import { useOrdersCtx } from '../contexts/ordersContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { Text, View } from 'react-native'
import { gStyles } from '../styles'
import InputSelect from './InputSelect'

function ScreenOrders({ route, navigation: { navigate } }) {
  useStore() //*<---- FIXME: if you remove this everything will break
  const { orders, ordersFetch, setFetchTypeOrders } = useOrdersCtx()
  console.log({ orders })

  console.log({ ordersIds: route?.params?.orders })
  const modal = useModal({
    title: 'Tipo de ordenes'
  })
  return (
    <>
      <StyledModal {...modal}>
        <Text style={gStyles.h3}>
          Selecciona que tipo de ordenes quieres ver
        </Text>
        <InputSelect
          options={[
            { label: 'Todas', value: 'all' },
            { label: 'Resueltas', value: 'solved' },
            { label: 'No resueltas', value: 'unsolved' },
            { label: 'Ordenes (Mias)', value: 'mine' },
            { label: 'Resueltas (Mias)', value: 'mineSolved' },
            { label: 'No resueltas (Mias)', value: 'mineUnsolved' }
          ]}
          value={ordersFetch}
          onChangeValue={setFetchTypeOrders}
        />
      </StyledModal>

      <ListOrders
        orders={orders}
        //defaultOrdersIds={filtered}

        sideButtons={[
          // {
          //   icon: 'download',
          //   label: '',
          //   onPress: handleToggleJustActiveOrders,
          //   visible: justActiveOrders
          // },
          // {
          //   icon: 'upload',
          //   label: '',
          //   onPress: handleToggleJustActiveOrders,
          //   visible: !justActiveOrders
          // },
          // {
          //   icon: 'refresh',
          //   label: '',
          //   onPress: debouncedFetchOrders,
          //   visible: true,
          //   disabled: disabled
          // },
          { icon: 'swap', label: '', onPress: modal.toggleOpen, visible: true },
          {
            icon: 'add',
            label: '',
            onPress: () => {
              // @ts-ignore
              navigate('NewOrder')
            },
            visible: true
          }
        ]}
      />
    </>
  )
}

export default ScreenOrders
