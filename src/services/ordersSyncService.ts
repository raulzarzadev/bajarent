import { AppDispatch } from '../state/store'
import {
  upsertOrder,
  removeOrder,
  setReports,
  addComment
} from '../state/features/orders/ordersSlice'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ServiceComments } from '../firebase/ServiceComments'
import OrderType from '../types/OrderType'

class OrdersSyncService {
  private dispatch: AppDispatch | null = null
  private listeners: Map<string, () => void> = new Map()
  private storeId: string | null = null
  private isListening: boolean = false

  setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch
  }

  setStoreId(storeId: string) {
    this.storeId = storeId
  }

  startListening() {
    if (!this.dispatch || !this.storeId || this.isListening) return

    this.isListening = true
    this.setupOrdersListener()
    this.setupCommentsListener()
  }

  stopListening() {
    this.listeners.forEach((unsubscribe) => unsubscribe())
    this.listeners.clear()
    this.isListening = false
  }

  private setupOrdersListener() {
    if (!this.storeId || !this.dispatch) return

    try {
      // ServiceOrders.listenUnsolved might return void, so we handle it differently
      const listenerResult = ServiceOrders.listenUnsolved(
        this.storeId,
        (orders: OrderType[]) => {
          if (this.dispatch) {
            orders.forEach((order) => {
              this.dispatch(upsertOrder(order))
            })
          }
        }
      )

      // If it returns a promise with unsubscribe function
      if (
        listenerResult &&
        typeof (listenerResult as any).then === 'function'
      ) {
        ;(listenerResult as any)
          .then((unsubscribe) => {
            if (typeof unsubscribe === 'function') {
              this.listeners.set('orders', unsubscribe)
            }
          })
          .catch((error) => {
            console.error('Error setting up orders listener:', error)
          })
      } else {
        // If it's synchronous and returns an unsubscribe function directly
        if (typeof listenerResult === 'function') {
          this.listeners.set('orders', listenerResult as any)
        }
      }
    } catch (error) {
      console.error('Error setting up orders listener:', error)
    }
  }

  private setupCommentsListener() {
    if (!this.storeId || !this.dispatch) return

    try {
      // For now, we'll poll for comments since we don't have a real-time listener
      // This can be optimized later with proper Firestore listeners
      const pollComments = async () => {
        try {
          const reports = await ServiceComments.getUnsolvedImportantAndReports(
            this.storeId!
          )
          if (this.dispatch) {
            this.dispatch(setReports(reports))

            // Add individual comments to store
            reports.forEach((comment) => {
              this.dispatch(addComment(comment))
            })
          }
        } catch (error) {
          console.error('Error polling comments:', error)
        }
      }

      // Poll every 30 seconds for comments
      const intervalId = setInterval(pollComments, 30000)

      // Initial fetch
      pollComments()

      // Store cleanup function
      this.listeners.set('comments', () => clearInterval(intervalId))
    } catch (error) {
      console.error('Error setting up comments listener:', error)
    }
  }

  // Manual sync methods for specific scenarios
  syncOrder(orderId: string) {
    if (!this.dispatch) return

    ServiceOrders.get(orderId)
      .then((order) => {
        if (order && this.dispatch) {
          this.dispatch(upsertOrder(order))
        }
      })
      .catch((error) => {
        console.error('Error syncing order:', error)
      })
  }

  deleteOrder(orderId: string) {
    if (!this.dispatch) return
    this.dispatch(removeOrder(orderId))
  }

  // Batch operations for better performance
  syncOrdersBatch(orderIds: string[]) {
    if (!this.dispatch || orderIds.length === 0) return

    const batchSize = 10 // Firestore batch limit consideration
    const batches = []

    for (let i = 0; i < orderIds.length; i += batchSize) {
      batches.push(orderIds.slice(i, i + batchSize))
    }

    batches.forEach(async (batch, index) => {
      // Stagger requests to avoid overwhelming Firestore
      setTimeout(async () => {
        try {
          const promises = batch.map((id) => ServiceOrders.get(id))
          const orders = await Promise.all(promises)

          orders.forEach((order) => {
            if (order && this.dispatch) {
              this.dispatch(upsertOrder(order))
            }
          })
        } catch (error) {
          console.error(`Error syncing batch ${index}:`, error)
        }
      }, index * 100) // 100ms delay between batches
    })
  }

  // Health check
  isHealthy(): boolean {
    return (
      this.isListening &&
      this.listeners.size > 0 &&
      !!this.dispatch &&
      !!this.storeId
    )
  }

  getStatus() {
    return {
      isListening: this.isListening,
      listenersCount: this.listeners.size,
      hasDispatch: !!this.dispatch,
      hasStoreId: !!this.storeId,
      activeListeners: Array.from(this.listeners.keys())
    }
  }
}

// Singleton instance
export const ordersSyncService = new OrdersSyncService()

// React hook to manage the sync service
export const useOrdersSync = (
  dispatch: AppDispatch,
  storeId: string | null
) => {
  const startSync = () => {
    if (storeId && dispatch) {
      ordersSyncService.setDispatch(dispatch)
      ordersSyncService.setStoreId(storeId)
      ordersSyncService.startListening()
    }
  }

  const stopSync = () => {
    ordersSyncService.stopListening()
  }

  const getStatus = () => {
    return ordersSyncService.getStatus()
  }

  return {
    startSync,
    stopSync,
    getStatus,
    isHealthy: ordersSyncService.isHealthy()
  }
}
