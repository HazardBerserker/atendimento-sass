import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    message: 'Carregando...',
  }),
  actions: {
    show(message = 'Carregando...') {
      this.message = message
      this.isLoading = true
    },
    hide() {
      this.isLoading = false
    },
  },
})
