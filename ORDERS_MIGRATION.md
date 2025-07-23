# Orders Redux Migration Guide

## Problemas de Rendimiento Identificados

### 1. **Múltiples Consultas Simultáneas**

- `getUnsolvedByStore` ejecuta 4 consultas en paralelo (rent pending, expired rents, repairs, sales)
- Cada consulta puede retornar cientos de documentos
- No hay cache ni persistencia local

### 2. **Re-renders Innecesarios**

- El contexto se actualiza completamente en cada cambio
- Todos los componentes suscritos se re-renderizan
- No hay normalización de datos

### 3. **Listeners Múltiples**

- Cada componente puede crear su propio listener
- Duplicación de datos en memoria
- Conexiones innecesarias con Firestore

## Optimizaciones Implementadas

### 1. **Normalización de Datos**

```typescript
// Antes: Array plano
orders: OrderType[]

// Ahora: Datos normalizados + listas categorizadas
orders: Record<string, OrderType>
orderIds: string[]
unsolvedOrders: string[]
myOrders: string[]
rentOrders: string[]
// etc...
```

### 2. **Cache Inteligente**

```typescript
// Cache de 5 minutos con invalidación manual
cacheExpiry: 5 * 60 * 1000
lastFetch: number | null

// Evita consultas innecesarias
if (!forceRefresh && cacheIsValid) {
  return cachedData
}
```

### 3. **Selectores Optimizados**

```typescript
// Selectores memorizados que solo se recalculan cuando cambian las dependencias
export const selectUnsolvedOrders = (state) =>
  state.orders.unsolvedOrders.map(id => state.orders.orders[id])
```

### 4. **Batching de Actualizaciones**

```typescript
// Actualizaciones en lotes para mejor rendimiento
const { entities, ids } = normalizeOrders(orders)
state.orders = entities // Una sola actualización
```

## Migración Paso a Paso

### 1. **Agregar OrdersProvider al App.js**

```typescript
// App.js
import { OrdersProvider } from './src/components/OrdersProvider'

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthContextProvider>
          <StoreContextProvider>
            <EmployeeContextProvider>
              <OrdersProvider> {/* Nuevo */}
                <OrdersContextProvider> {/* Mantener temporalmente */}
                  <ItemsProvider>
                    <ReduxInitializer>
                      <ThemeProvider>
                        <BottomAppBarE />
                      </ThemeProvider>
                    </ReduxInitializer>
                  </ItemsProvider>
                </OrdersContextProvider>
              </OrdersProvider>
            </EmployeeContextProvider>
          </StoreContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </Provider>
  )
}
```

### 2. **Migrar Componentes Gradualmente**

#### Antes:

```typescript
import { useOrdersCtx } from '../contexts/ordersContext'

const MyComponent = () => {
  const { orders, loading, handleRefresh } = useOrdersCtx()

  return (
    <View>
      {loading && <Loading />}
      {orders?.map(order => <OrderCard key={order.id} order={order} />)}
    </View>
  )
}
```

#### Después:

```typescript
import { useOrdersRedux } from '../hooks/useOrdersRedux'

const MyComponent = () => {
  const { orders, loading, refreshOrders } = useOrdersRedux('MyComponent')

  return (
    <View>
      {loading && <Loading />}
      {orders.map(order => <OrderCard key={order.id} order={order} />)}
    </View>
  )
}
```

#### O usar hooks especializados:

```typescript
import { useMyOrders } from '../hooks/useOrdersRedux'

const MyOrdersScreen = () => {
  const { orders, loading, refresh, stats } = useMyOrders('MyOrdersScreen')

  return (
    <View>
      <Text>Mis órdenes ({stats.total})</Text>
      {loading && <Loading />}
      {orders.map(order => <OrderCard key={order.id} order={order} />)}
    </View>
  )
}
```

### 3. **Para compatibilidad temporal**

```typescript
// Usar el hook de compatibilidad para migración gradual
import { useOrdersCtxCompatible } from '../hooks/useOrdersRedux'

const ExistingComponent = () => {
  const { orders, reports, handleRefresh } = useOrdersCtxCompatible()
  // El resto del código permanece igual
}
```

## Hooks Disponibles

### 1. **useOrdersRedux** - Hook principal

```typescript
const {
  orders,           // Todas las órdenes
  unsolvedOrders,   // Órdenes sin resolver
  myOrders,         // Mis órdenes (por sección)
  reports,          // Reportes y comentarios
  stats,           // Estadísticas (conteos)
  loading,         // Estado de carga
  error,           // Errores
  refreshOrders,   // Refrescar datos
  forceRefresh,    // Forzar actualización (ignora cache)
  changeFetchType, // Cambiar tipo de consulta
} = useOrdersRedux('ComponentId')
```

### 2. **useMyOrders** - Para órdenes personales

```typescript
const {
  orders,    // Solo mis órdenes
  loading,   // Estado de carga
  refresh,   // Refrescar
  stats      // Estadísticas (total, expired)
} = useMyOrders('MyOrdersComponent')
```

### 3. **useUnsolvedOrders** - Para órdenes sin resolver

```typescript
const {
  orders,    // Órdenes sin resolver
  loading,   // Estado de carga
  refresh,   // Refrescar
  stats      // Estadísticas (total, rent, repair, sale)
} = useUnsolvedOrders('UnsolvedOrdersComponent')
```

### 4. **useOrdersStats** - Solo estadísticas

```typescript
const {
  stats,     // Todas las estadísticas
  loading,   // Estado de carga
  isEmpty    // Si no hay órdenes
} = useOrdersStats()
```

## Mejoras de Rendimiento Esperadas

### 1. **Reducción de Consultas**

- Antes: 4+ consultas por carga
- Ahora: 1 consulta con cache de 5 minutos

### 2. **Menos Re-renders**

- Antes: Todo el árbol se re-renderiza
- Ahora: Solo componentes que usan datos específicos

### 3. **Mejor Gestión de Memoria**

- Datos normalizados (no duplicados)
- Cleanup automático de listeners
- Cache con expiración

### 4. **Experiencia de Usuario**

- Datos instantáneos desde cache
- Indicadores de carga específicos
- Actualizaciones en tiempo real optimizadas

## Monitoreo y Debug

### En desarrollo:

```typescript
const { getPerformanceMetrics } = useOrdersRedux('DebugComponent')

console.log(getPerformanceMetrics())
// {
//   totalOrders: 150,
//   listenersCount: 3,
//   cacheAge: 120000, // 2 minutos
//   isExpired: false,
//   memoryUsage: {
//     orders: 150,
//     reports: 25,
//     comments: 10
//   }
// }
```

### Redux DevTools:

- Ver todas las acciones de órdenes
- Inspeccionar estado normalizado
- Time-travel debugging
- Performance profiling

## Rollback Plan

Si hay problemas, se puede hacer rollback fácil:

1. Comentar `OrdersProvider` en App.js
2. Los componentes con `useOrdersCtxCompatible` seguirán funcionando
3. Gradualmente volver a `useOrdersCtx` si es necesario

El contexto original se mantiene intacto durante la migración.
