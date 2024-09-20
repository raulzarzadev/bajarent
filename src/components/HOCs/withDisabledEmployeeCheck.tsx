import React from 'react'
import DisabledEmployee from '../DisabledEmployee'
import { useEmployee } from '../../contexts/employeeContext'

interface WithDisabledCheckProps {
  isDisabled: boolean
}

const withDisabledCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithDisabledCheck: React.FC<P & WithDisabledCheckProps> = (
    props
  ) => {
    const { disabledEmployee } = useEmployee()
    const { ...otherProps } = props

    if (disabledEmployee === true || disabledEmployee === undefined) {
      return <DisabledEmployee />
    }

    return <WrappedComponent {...(otherProps as P)} />
  }

  return ComponentWithDisabledCheck
}

export default withDisabledCheck
