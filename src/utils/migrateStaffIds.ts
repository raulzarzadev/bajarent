import { ServiceStores } from '../firebase/ServiceStore'

export const migrateStaffIds = async () => {
  console.log('Starting migration...')
  const stores = await ServiceStores.getItems([])
  console.log(`Found ${stores.length} stores`)
  let count = 0
  for (const store of stores) {
    const staff = store.staff || []
    const staffUserIds = new Set(store.staffUserIds || [])

    // Add staff user ids
    staff.forEach((s) => {
      if (s.userId) staffUserIds.add(s.userId)
    })

    // Add owner
    if (store.createdBy) {
      staffUserIds.add(store.createdBy)
    }

    const newStaffUserIds = Array.from(staffUserIds) as string[]

    // Update store
    await ServiceStores.update(store.id, { staffUserIds: newStaffUserIds })
    console.log(
      `Updated store ${store.name} with ${newStaffUserIds.length} staff members`
    )
    count++
  }
  console.log(`Migration finished. Updated ${count} stores.`)
}
