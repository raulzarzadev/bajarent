import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'
import theme from '../theme'
import Button from './Button'
import StartupLoader from './StartupLoader'
import ScreenStoreCreate from './ScreenStoreCreate'
import { reloadApp } from '../libs/reloadApp'

const StoreSelection = () => {
  const {
    stores = [],
    storeId,
    user,
    storesStatus,
    storesError,
    handleSetStoreId,
    handleSetUserStores
  } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const sortedStores = useMemo(() => {
    return [...stores].sort((a, b) => a.name.localeCompare(b.name))
  }, [stores])

  if (storesStatus === 'idle' || storesStatus === 'loading') {
    return (
      <StartupLoader
        title="Sincronizando tus tiendas"
        description="Buscando en cuáles tiendas formas parte..."
      />
    )
  }

  if (storesStatus === 'error') {
    return (
      <View style={styles.container}>
        <Text style={[gStyles.h2, { textAlign: 'center' }]}>¡Ups!</Text>
        <Text
          style={[gStyles.helper, { textAlign: 'center', marginVertical: 8 }]}
        >
          {storesError || 'No pudimos obtener tus tiendas. Inténtalo de nuevo.'}
        </Text>
        <Button
          label="Reintentar"
          onPress={() => user?.id && handleSetUserStores(user.id)}
        />
      </View>
    )
  }

  const handleSelectStore = async (id: string) => {
    if (id === storeId) return
    await handleSetStoreId(id)
    await reloadApp()
  }

  return (
    <View style={styles.container}>
      <Text style={[gStyles.h2, { marginBottom: 12, textAlign: 'center' }]}>
        Selecciona una tienda
      </Text>
      <Text style={[gStyles.helper, { textAlign: 'center', marginBottom: 16 }]}>
        Esta selección permite cargar únicamente los datos necesarios.
      </Text>

      {sortedStores.length > 0 ? (
        <FlatList
          data={sortedStores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              role="button"
              onPress={() => handleSelectStore(item.id)}
              style={[
                styles.store,
                item.id === storeId && {
                  borderColor: theme.primary,
                  backgroundColor: theme.primary + '11'
                }
              ]}
            >
              <Text
                numberOfLines={2}
                style={[
                  gStyles.h3,
                  { color: theme.black, textAlign: 'center' }
                ]}
              >
                {item.name}
              </Text>
              {!!item.description && (
                <Text
                  style={[
                    gStyles.helper,
                    { marginTop: 4, textAlign: 'center' }
                  ]}
                >
                  {item.description}
                </Text>
              )}
            </Pressable>
          )}
        />
      ) : (
        <View style={{ marginVertical: 24 }}>
          <Text style={[gStyles.helper, { textAlign: 'center' }]}>
            Aún no perteneces a ninguna tienda.
          </Text>
          <Text style={[gStyles.helper, { textAlign: 'center', marginTop: 8 }]}>
            Puedes crear una nueva tienda para comenzar a trabajar.
          </Text>
        </View>
      )}

      {!!user?.canCreateStore && (
        <Button
          label={showCreateForm ? 'Cerrar creación' : 'Crear tienda'}
          onPress={() => setShowCreateForm((prev) => !prev)}
          buttonStyles={{ marginTop: 24 }}
        />
      )}

      <Modal visible={showCreateForm} animationType="slide">
        <View style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <Button
              variant="ghost"
              label="Cerrar"
              onPress={() => setShowCreateForm(false)}
            />
          </View>
          <ScreenStoreCreate
            navigation={{ goBack: () => setShowCreateForm(false) }}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
  },
  store: {
    borderWidth: 1,
    borderColor: theme.accent,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: theme.white,
    shadowColor: theme.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  }
} as const

export default StoreSelection
