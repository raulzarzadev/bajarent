import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { BottomAppBarE } from './BottomAppBar'
import StartupLoader from './StartupLoader'
import StoreSelection from './StoreSelection'

const AppBootstrap = () => {
	const { user, isAuthReady, storeId, clearStoreSelection } = useAuth()
	const { isStoreReady } = useStore()
	const { isEmployeeReady } = useEmployee()

	if (!isAuthReady || user === undefined) {
		return <StartupLoader title="Autenticando" description="Verificando tu sesión segura..." />
	}

	if (!user) {
		return <BottomAppBarE />
	}

	if (!storeId) {
		return <StoreSelection />
	}

	if (!isStoreReady) {
		return (
			<StartupLoader
				title="Preparando la tienda"
				description="Sincronizando catálogos, personal y balances..."
			/>
		)
	}

	if (!isEmployeeReady) {
		return (
			<StartupLoader
				title="Aplicando permisos"
				description="Determinando roles y accesos para esta sesión..."
				handleTimeout={() => {
					console.warn('Employee loading timeout exceeded')
					clearStoreSelection()
				}}
			/>
		)
	}

	return <BottomAppBarE />
}

export default AppBootstrap
