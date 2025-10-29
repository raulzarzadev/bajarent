# Bajarent - AI Coding Assistant Instructions

## Project Overview

**Bajarent** is a React Native Expo app (v49) for rental/repair shop management with web + mobile support. Firebase Firestore backend with Redux Toolkit state management migrating from Context API.

## Tech Stack

- **Framework**: React Native (0.72) + Expo 49 + TypeScript
- **State**: Redux Toolkit + React Context (legacy, being migrated)
- **Backend**: Firebase Firestore + Firebase Admin
- **Forms**: Formik with custom `Formik*` components
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Testing**: Bun test runner + Cypress (E2E)
- **Build**: Babel + babel-module-resolver
- **Package Manager**: Bun (lockfile: `bun.lockb`)

## Critical Architecture Patterns

### 1. Performance Optimization (Priority)

**Context Migration to Redux** - Active migration with significant performance improvements

#### Problem (Legacy Context):

```typescript
// ❌ OLD: 4+ parallel Firestore queries, no cache, full re-renders
ServiceOrders.getUnsolvedByStore(storeId)
// → rent pending + expired rents + repairs + sales (hundreds of docs)
// → Every component re-renders on ANY change
// → Multiple listeners duplicate data in memory
```

#### Solution (Redux with Normalization):

```typescript
// ✅ NEW: Single query with 5min cache + normalized state
const { orders, loading, stats } = useOrdersRedux('ComponentId')

// State structure:
{
  orders: Record<string, OrderType>,     // Normalized by ID
  orderIds: string[],                    // All IDs
  unsolvedOrders: string[],             // Filtered ID lists
  myOrders: string[],
  rentOrders: string[],
  // ... cached data, 5min expiry
}
```

#### Performance Gains:

- **80% fewer queries**: 4+ → 1 with cache
- **Selective re-renders**: Only components using changed data update
- **Memory optimization**: Normalized data prevents duplication

#### Migration Path:

```typescript
// OLD (Context API - being replaced):
import { useOrdersCtx } from '../contexts/ordersContext'
const { orders, loading } = useOrdersCtx()

// NEW (Redux - preferred):
import { useOrdersRedux } from '../hooks/useOrdersRedux'
const { orders, loading } = useOrdersRedux('MyComponent')

// SPECIALIZED HOOKS:
useMyOrders('MyOrdersScreen')          // Orders by my sections
useUnsolvedOrders('UnsolvedScreen')    // Unsolved only
useOrdersStats()                       // Stats without full data
```

**Cache Strategy**:

- Default: 5 minutes (`cacheExpiry: 5 * 60 * 1000`)
- Auto-refresh on stale data
- Manual refresh: `refreshOrders()` (uses cache) or `forceRefresh()` (bypasses cache)

**Dev Performance Monitoring**:

```typescript
const { getPerformanceMetrics } = useOrdersRedux('DebugComponent')
if (__DEV__) console.log(getPerformanceMetrics())
// { totalOrders, listenersCount, cacheAge, isExpired, memoryUsage }
```

See `ORDERS_MIGRATION.md` for complete migration guide.  
See `PERFORMANCE_STATUS.md` for current migration status and priorities.

### 2. Immutability is MANDATORY

Redux enforces immutable state. **Never mutate objects directly**:

```typescript
// ❌ WRONG - Will error "Cannot assign to read only property"
order.fullName = customer.name

// ✅ CORRECT - Create new object
const updatedOrder = { ...order, fullName: customer.name }
```

See `IMMUTABILITY_FIX.md` for detailed examples.

### 3. Hybrid State Management (Redux + Context)

**Active migration**: Orders moving from Context → Redux (`ORDERS_MIGRATION.md`)

**Use Redux for** (normalized + cached):

- ✅ `orders` - Using `useOrdersRedux()`, `useMyOrders()`, `useUnsolvedOrders()`
- ✅ `customers` - Using `useCustomers()`
- ✅ `currentWork` - Using `useCurrentWorkFetch()`

**Still in Context** (temporary, don't add new features here):

- ⚠️ `auth` - Using `useAuth()`
- ⚠️ `store` - Using `useStore()`
- ⚠️ `employee` - Using `useEmployee()`
- ⚠️ `items` - Using `useItems()`
- ⚠️ `theme` - Using `useTheme()`

```tsx
// Provider hierarchy (App.js):
<Provider store={store}>
  <AuthContextProvider>
    <StoreContextProvider>
      <EmployeeContextProvider>
        <OrdersProvider>            {/* Redux-based - NEW */}
          <OrdersContextProvider>   {/* Legacy Context - DEPRECATED */}
            <ItemsProvider>
              <ReduxInitializer>    {/* Initializes Redux state */}
                <ThemeProvider>
                  <BottomAppBarE />
```

**Rule**: New features → Redux. Don't add to Context API.

````

### 4. Firebase Service Pattern

All Firestore operations use `FirebaseGenericService<T>` base class:

```typescript
// Pattern: src/firebase/Service{Entity}.ts
class ServiceOrdersClass extends FirebaseGenericService<OrderType> {
  constructor() { super('orders') }

  // Custom methods extend base CRUD
  async createSerialOrder(order: OrderType): Promise<string> { ... }

  // Complex queries for performance
  async getUnsolvedByStore(storeId: string, options: {...}): Promise<OrderType[]> {
    // 4 parallel queries: rent pending + expired rents + repairs + sales
    // ⚠️ Performance bottleneck - being cached in Redux
  }
}
export const ServiceOrders = new ServiceOrdersClass()
````

**Base CRUD methods**: `create`, `update`, `get`, `delete`, `listen`, `listenMany`, `findOne`, `getItems`

**Custom query methods**:

- `ServiceOrders.createSerialOrder()` - Creates order + increments store folio (ALWAYS use this, not `create()`)
- `ServiceOrders.getUnsolvedByStore()` - Complex multi-query (4 parallel Firestore queries)
- `ServiceOrders.getBySections()` - Filter orders by employee sections### 5. Formik Component Pattern

Custom form components follow `Formik{ComponentType}` naming:

```tsx
// All use useField() hook from formik
<FormikInputValue name="folio" label="Folio" />
<FormikInputSelect name="status" options={statusOptions} />
<FormikCheckbox name="enabled" label="Active" />
```

Located in `src/components/Formik*.tsx`

### 6. Platform-Specific Code

```typescript
// Use __DEV__ for dev-only features
if (__DEV__) console.log('Debug info')

// Platform detection
import { Platform } from 'react-native'
if (Platform.OS === 'web') { ... }
```

### 7. Permission-Based Rendering

```tsx
const { permissions, employee } = useEmployee()
// Check before rendering features:
if (permissions.isAdmin || permissions.orders.canDelete) { ... }
```

## Type System

- **Types**: `src/types/{Entity}Type.ts` (e.g., `OrderType`, `StoreType`)
- **Enums**: Use TypeScript enums + const objects for both runtime and type safety

```typescript
export enum order_status { PENDING = 'PENDING', DELIVERED = 'DELIVERED' }
export type OrderStatus = keyof typeof order_status
```

## Key Workflows

### Testing

```bash
bun test                 # Unit tests
bun cy:run              # Cypress E2E (headless)
bun cy:open             # Cypress interactive
bun type-check          # TypeScript validation
bun fast-test           # Type check + tests
bun perf:audit          # Performance audit (migration status)
```

### Build & Deploy

```bash
bun start               # Expo dev server
bun web                 # Web dev server
bun build:web           # Production web build
bun fast-push           # Test + merge to main + push
bun push:patch          # Version bump patch + push
```

### Git Workflow

- **Main branch**: `main`
- **Dev branch**: `dev` (current)
- Commit script: `bun commit` (runs type-check + cypress + git add + commit)

## Redux Slice Patterns

```typescript
// Normalized state for performance (see ordersSlice.ts)
orders: Record<string, OrderType>  // Keyed by ID
orderIds: string[]                 // Array of IDs
unsolvedOrders: string[]          // Filtered ID lists
```

Selectors use ID arrays + entity lookup:

```typescript
export const selectUnsolvedOrders = (state: RootState) =>
  state.orders.unsolvedOrders.map(id => state.orders.orders[id])
```

## Navigation Structure

- `BottomAppBar.tsx`: Main tab navigator
  - `StackOrders`: Order management
  - `StackStore`: Store settings
  - `StackProfile`: User profile
  - `StackItems`: Inventory (permission-gated)
  - `StackWorkshop`: Repair workflow (role-based)
  - `StackCustomers`: Customer management

## Common Pitfalls

1. **Don't mutate Redux state** - Always spread objects/arrays
2. **Check permissions** before rendering admin features
3. **Use `ServiceOrders.createSerialOrder()`** not `create()` for orders (handles folio increment)
4. **Platform imports**: Import `Platform` from `react-native`, not `expo`
5. **Context migration**: Prefer Redux for new features, don't add to Context
6. **Formik naming**: Custom components MUST start with `Formik*`
7. **Performance**: Use specialized hooks (`useMyOrders`, `useUnsolvedOrders`) instead of filtering all orders
8. **Cache awareness**: Use `refreshOrders()` for cached refresh, `forceRefresh()` to bypass cache

## Environment Variables

- `.env.local`: Local development
- `.env.local.browser`: Web-specific config
- Uses `react-native-dotenv` plugin (configured in `babel.config.js`)

## Documentation

- `IMMUTABILITY_FIX.md`: Redux immutability patterns
- `ORDERS_MIGRATION.md`: Context → Redux migration guide
- Type definitions are the source of truth for data structures
