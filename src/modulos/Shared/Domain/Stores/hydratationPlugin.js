export function hydrationPlugin({ store }) {
  if (store.$id === 'auth') {
    store.isHydrated = true
  }
}
