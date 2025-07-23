import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state/store'
import { useAuth } from '../contexts/authContext'
import { useOrdersSync } from '../services/ordersSyncService'

/**
 * OrdersProvider - Component that initializes the Redux orders state
 * and manages real-time synchronization
 */
export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { storeId, isAuthenticated } = useAuth()
  const { startSync, stopSync, getStatus } = useOrdersSync(dispatch, storeId)

  useEffect(() => {
    if (isAuthenticated && storeId) {
      startSync()

      return () => {
        stopSync()
      }
    }
  }, [isAuthenticated, storeId, startSync, stopSync])

  // Debug info in development
  useEffect(() => {
    if (__DEV__) {
      const status = getStatus()
      console.log('Orders sync status:', status)
    }
  }, [getStatus])

  return <>{children}</>
}

/**
 * Performance Monitor Component (Dev only)
 */
export const OrdersPerformanceMonitor: React.FC = () => {
  if (!__DEV__) return null

  // This component can be used to monitor Redux DevTools
  // and display performance metrics in development
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}
    >
      Redux Orders Active
    </div>
  )
}
