import type { NavigationState } from '@react-navigation/native'

// Lightweight logger to track navigation transitions during QA/debug.
// Avoid heavy console spam: only log route names and params at top level.
export function logNavigationStateChange(state?: NavigationState) {
  if (!state) return
  try {
    const current = getActiveRoute(state)
    console.log('[nav]', {
      route: current?.name,
      params: current?.params || null,
      index: state.index,
      routes: state.routes.map((r) => r.name)
    })
  } catch (err) {
    console.warn('[nav] logger failed', err)
  }
}

function getActiveRoute(state: NavigationState): any {
  const route = state.routes[state.index]
  if (!route) return null
  if (route.state) {
    // @ts-ignore nested state may exist; recurse
    return getActiveRoute(route.state)
  }
  return route
}
