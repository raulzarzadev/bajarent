import type React from 'react'
import { useEmployee } from '../../contexts/employeeContext'
import DisabledEmployee from '../DisabledEmployee'
import Loading from '../Loading'
import TextInfo from '../TextInfo'

type WithDisabledCheckProps = {}

const withDisabledCheck = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
	const ComponentWithDisabledCheck: React.FC<P & WithDisabledCheckProps> = props => {
		const {
			disabledEmployee,
			permissions: { isAdmin, isOwner },
			employee
		} = useEmployee()
		const { ...otherProps } = props
		// ** admin or owner can't be disabled
		if (disabledEmployee === undefined) return <Loading id="withDisabledCheck" />
		if (isAdmin || isOwner) return <WrappedComponent {...(otherProps as P)} />
		if (disabledEmployee) return <DisabledEmployee />

		return <WrappedComponent {...(otherProps as P)} />
	}

	return ComponentWithDisabledCheck
}

export default withDisabledCheck
