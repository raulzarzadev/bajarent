import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { limit, orderBy, QueryConstraint, startAfter } from 'firebase/firestore'
import Button from '../Button'
import { AppErrorType, ServiceAppErrors } from '../../firebase/ServiceAppErrors'
import { ServiceUsers } from '../../firebase/ServiceUser'
import asDate, { dateFormat } from '../../libs/utils-date'

export const AppErrorLogs = () => {
  const PAGE_SIZE = 20
  const [errors, setErrors] = useState<AppErrorType[]>([])
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPaginating, setIsPaginating] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const lastCursorRef = useRef<any>(null)
  const userNamesRef = useRef<Record<string, string>>({})

  const loadUserNames = useCallback(async (entries: AppErrorType[]) => {
    const missingIds = entries
      .map((entry) => entry.createdBy)
      .filter((id): id is string => typeof id === 'string' && id.length > 0)
      .filter((id) => !userNamesRef.current[id])

    if (!missingIds.length) return

    const uniqueIds = Array.from(new Set(missingIds))
    const resolved = await Promise.all(
      uniqueIds.map(async (userId): Promise<[string, string]> => {
        try {
          const user = await ServiceUsers.get(userId)
          const label =
            user?.name || user?.email || user?.phone || 'Usuario desconocido'
          return [userId, label]
        } catch (error) {
          console.warn('No se pudo obtener el usuario', userId, error)
          return [userId, 'Usuario desconocido']
        }
      })
    )

    setUserNames((prev) => {
      const next = { ...prev }
      resolved.forEach(([id, label]) => {
        next[id] = label
      })
      userNamesRef.current = next
      return next
    })
  }, [])

  const fetchErrors = useCallback(
    async (mode: 'reset' | 'append' = 'reset') => {
      const isLoadMore = mode === 'append'
      setFetchError(null)
      isLoadMore ? setIsPaginating(true) : setIsLoading(true)
      if (mode === 'reset') {
        lastCursorRef.current = null
        setHasMore(true)
      }

      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

      if (isLoadMore && lastCursorRef.current) {
        constraints.push(startAfter(lastCursorRef.current))
      }

      constraints.push(limit(PAGE_SIZE))

      try {
        const fetchedErrors =
          (await ServiceAppErrors.getItems(constraints)) ?? []
        setErrors((prev) =>
          isLoadMore ? [...prev, ...fetchedErrors] : fetchedErrors
        )
        const lastFetched = fetchedErrors[fetchedErrors.length - 1]
        lastCursorRef.current = lastFetched?.createdAt ?? lastCursorRef.current
        setHasMore(fetchedErrors.length === PAGE_SIZE && !!lastFetched)
        if (fetchedErrors.length) {
          await loadUserNames(fetchedErrors)
        }
      } catch (error) {
        console.error('Error loading app errors', error)
        setFetchError('No se pudieron cargar los errores. Intenta nuevamente.')
      } finally {
        isLoadMore ? setIsPaginating(false) : setIsLoading(false)
      }
    },
    [PAGE_SIZE, loadUserNames]
  )

  useEffect(() => {
    fetchErrors('reset')
  }, [fetchErrors])

  const handleLoadMore = () => {
    if (!hasMore || isPaginating || isLoading) return
    fetchErrors('append')
  }

  const isInitialLoading = isLoading && !errors.length

  type ExpandableFieldProps = { label: string; value?: string }
  const ExpandableField = ({ label, value }: ExpandableFieldProps) => {
    const [expanded, setExpanded] = useState(false)
    if (!value) return null
    return (
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ fontWeight: '600', color: '#111827' }}>{label}</Text>
          <Text
            onPress={() => setExpanded((prev) => !prev)}
            style={{ color: '#2563eb', fontSize: 12 }}
          >
            Ver {expanded ? 'menos' : 'más'}
          </Text>
        </View>
        <Text
          selectable
          numberOfLines={expanded ? undefined : 3}
          style={{ marginTop: 4, fontSize: 12, color: '#374151' }}
        >
          {value}
        </Text>
      </View>
    )
  }
  const ErrorCard = ({ error }: { error: AppErrorType }) => {
    const createdByLabel =
      (error.createdBy && userNames[error.createdBy]) ||
      error.createdBy ||
      'Usuario desconocido'

    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            {dateFormat(asDate(error.createdAt), 'dd/MMM/yy HH:mm') ??
              'Sin fecha'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {createdByLabel}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#111827',
              marginRight: 12
            }}
          >
            {error.code}
          </Text>
          {error.componentName && (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: '#e0f2fe'
              }}
            >
              <Text style={{ fontSize: 12, color: '#0369a1' }}>
                {error.componentName}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 8 }}>
          {error.message}
        </Text>

        <ExpandableField label="Info" value={error.info} />
        <ExpandableField label="Stack" value={error.stack} />

        {error.userAgent && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: '600', color: '#111827' }}>
              User Agent
            </Text>
            <Text
              selectable
              style={{ marginTop: 4, fontSize: 12, color: '#4b5563' }}
            >
              {error.userAgent}
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f3f4f6' }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
        App Error Logs
      </Text>
      {fetchError && (
        <Text style={{ color: '#dc2626', marginBottom: 8 }}>{fetchError}</Text>
      )}

      {isInitialLoading ? (
        <View style={{ paddingVertical: 32 }}>
          <ActivityIndicator />
        </View>
      ) : errors.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>Sin errores recientes.</Text>
      ) : (
        <>
          {errors.map((error) => (
            <ErrorCard key={error.id} error={error} />
          ))}
          <Button
            label={
              hasMore
                ? isPaginating
                  ? 'Cargando...'
                  : 'Cargar más'
                : 'No hay más resultados'
            }
            variant="outline"
            onPress={handleLoadMore}
            disabled={!hasMore || isPaginating}
          />
        </>
      )}
    </View>
  )
}
