import React from 'react'
import DisabledEmployee from '../DisabledEmployee'
import { useEmployee } from '../../contexts/employeeContext'
import { Text } from 'react-native'
import TextInfo from '../TextInfo'

interface WithDisabledCheckProps {
  // isDisabled: boolean
}

const withDisabledCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithDisabledCheck: React.FC<P & WithDisabledCheckProps> = (
    props
  ) => {
    const {
      disabledEmployee,
      permissions: { isAdmin, isOwner }
    } = useEmployee()
    const { ...otherProps } = props

    if (disabledEmployee) {
      if (isAdmin || isOwner) {
        return (
          <>
            <DisabledEmployee />
            <TextInfo
              defaultVisible
              text=" Este usuario no puede ser deshabilitado. (Admin/Owner)"
            />

            <WrappedComponent {...(otherProps as P)} />
          </>
        )
      }
      return <DisabledEmployee />
    }

    return <WrappedComponent {...(otherProps as P)} />
  }

  return ComponentWithDisabledCheck
}

export default withDisabledCheck
