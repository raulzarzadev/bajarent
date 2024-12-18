import React from 'react'
import DisabledEmployee from '../DisabledEmployee'
import { useEmployee } from '../../contexts/employeeContext'
import TextInfo from '../TextInfo'
import Loading from '../Loading'

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
      permissions: { isAdmin, isOwner },
      employee
    } = useEmployee()
    const { ...otherProps } = props
    // ** admin or owner can't be disabled
    if (disabledEmployee === undefined) return <Loading />
    if (isAdmin || isOwner) return <WrappedComponent {...(otherProps as P)} />
    if (disabledEmployee) return <DisabledEmployee />

    return <WrappedComponent {...(otherProps as P)} />
  }

  return ComponentWithDisabledCheck
}

export default withDisabledCheck
