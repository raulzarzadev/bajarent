import { View } from 'react-native'
import React from 'react'
import Button, { ButtonProps } from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import FormPrice from './FormPrice'
import { PriceType } from '../types/PriceType'
import { IconName } from './Icon'

const ModalFormPrice = ({
  handleSubmit,
  values,
  icon = 'add',
  variant = 'filled'
}: {
  icon?: IconName
  variant?: ButtonProps['variant']
  values?: Partial<PriceType>
  handleSubmit: (values: Partial<PriceType>) => Promise<any>
}) => {
  const isEdit = !!values?.id
  const modal = useModal({
    title: isEdit ? 'Editar precio' : 'Agregar precio'
  })
  console.log({ values })
  return (
    <View>
      <Button
        variant={variant}
        icon={icon}
        justIcon
        onPress={modal.toggleOpen}
      ></Button>
      <StyledModal {...modal}>
        <FormPrice
          defaultPrice={values}
          handleSubmit={(price) => {
            modal.toggleOpen()
            console.log({ price })
            return handleSubmit(price)
          }}
        />
      </StyledModal>
    </View>
  )
}

export default ModalFormPrice
