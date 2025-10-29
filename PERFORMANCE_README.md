# 🚀 Performance Optimization - Quick Start

## TL;DR

**Problema**: Context API causa 4+ queries paralelas por carga, re-renders masivos, sin cache.  
**Solución**: Redux con normalización, cache de 5 minutos, selectores optimizados.  
**Resultado**: 80% menos queries, re-renders selectivos, mejor UX.

## Estado Actual

```bash
bun perf:audit  # Ver estado de migración
```

**Progreso actual**: ~28% migrado (5/18 componentes)

## Quick Actions

### Usar Redux en nuevos componentes

```typescript
// ✅ Recomendado: Hook especializado
import { useMyOrders } from '../hooks/useOrdersRedux'

const MyComponent = () => {
  const { orders, loading, stats, refresh } = useMyOrders('MyComponent')

  return (
    <View>
      {loading && <Loader />}
      {orders.map(order => <OrderCard key={order.id} order={order} />)}
    </View>
  )
}
```

### Migrar componente existente

```typescript
// ❌ Antes (Context API)
import { useOrdersCtx } from '../contexts/ordersContext'
const { orders, loading } = useOrdersCtx()

// ✅ Después (Redux)
import { useOrdersRedux } from '../hooks/useOrdersRedux'
const { orders, loading } = useOrdersRedux('ComponentName')
```

### Verificar performance en dev

```typescript
const { getPerformanceMetrics } = useOrdersRedux('DebugComponent')

useEffect(() => {
  if (__DEV__) {
    const metrics = getPerformanceMetrics()
    console.log('📊 Performance:', {
      totalOrders: metrics.totalOrders,
      cacheAge: `${(metrics.cacheAge / 1000).toFixed(0)}s`,
      isExpired: metrics.isExpired,
      memoryUsage: metrics.memoryUsage
    })
  }
}, [])
```

## Hooks Disponibles

| Hook                  | Uso                  | Performance                |
| --------------------- | -------------------- | -------------------------- |
| `useOrdersRedux()`    | Todas las órdenes    | ⚡ Con cache, normalizado  |
| `useMyOrders()`       | Solo mis órdenes     | ⚡⚡ Filtrado optimizado   |
| `useUnsolvedOrders()` | Órdenes sin resolver | ⚡⚡ Pre-filtrado en Redux |
| `useOrdersStats()`    | Solo estadísticas    | ⚡⚡⚡ Sin cargar órdenes  |

## Comandos Útiles

```bash
# Verificar componentes que usan Context
grep -r "useOrdersCtx" src/ --include="*.tsx" --include="*.ts"

# Verificar componentes que usan Redux
grep -r "useOrdersRedux\|useMyOrders\|useUnsolvedOrders" src/

# Ver progreso completo
bun perf:audit

# Tests
bun test

# Type checking
bun type-check
```

## Prioridades de Migración

**🔴 Alta Prioridad** (impacto inmediato):

- `ScreenWorkshop.tsx` - Pantalla principal con muchos re-renders
- `SpanOrder.tsx` - Usado en múltiples lugares

**🟡 Media Prioridad**:

- `ListOrdersConsolidated.tsx`
- `ScreenStore5.tsx`
- `StoreTabMap.tsx`

**🟢 Baja Prioridad**:

- `ButtonAddCustomer.tsx`
- `useFilter.tsx`

## Documentación Completa

- 📖 [PERFORMANCE_STATUS.md](./PERFORMANCE_STATUS.md) - Estado detallado y roadmap
- 📖 [ORDERS_MIGRATION.md](./ORDERS_MIGRATION.md) - Guía completa de migración
- 📖 [IMMUTABILITY_FIX.md](./IMMUTABILITY_FIX.md) - Patrones de inmutabilidad
- 📖 [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Guía para AI agents

## Métricas Clave

### Antes (Context API)

- 📉 4-6 queries por carga
- 📉 Sin cache
- 📉 Re-renders completos
- 📉 Datos duplicados

### Ahora (Redux)

- 📈 1 query con cache de 5min
- 📈 Cache automático
- 📈 Re-renders selectivos
- 📈 Datos normalizados

## Problemas Comunes

### Error: "Cannot assign to read only property"

```typescript
// ❌ WRONG
order.fullName = customer.name

// ✅ CORRECT
const updatedOrder = { ...order, fullName: customer.name }
```

### Cache no se actualiza

```typescript
// Usa forceRefresh() en lugar de refreshOrders()
const { forceRefresh } = useOrdersRedux('MyComponent')
await forceRefresh()
```

### Componente no se actualiza con nuevos datos

```typescript
// Asegúrate de usar el componentId único
const { orders } = useOrdersRedux('UniqueComponentName')
// NO: useOrdersRedux() sin ID
```

## Contribuir

1. Antes de cambios: `bun perf:audit`
2. Hacer cambios
3. Después de cambios: `bun perf:audit`
4. Documentar mejoras en PERFORMANCE_STATUS.md

---

**Última actualización**: 28 de octubre de 2025  
**Mantenedores**: AI Coding Agents + Dev Team
