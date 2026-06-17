import { defineStore } from 'pinia'

export const useTemaStore = defineStore('tema', {
  state: () => ({
    temaAtual: localStorage.getItem('tema-sales') || 'light',
  }),
  actions: {
    setTema(tema) {
      this.temaAtual = tema
      localStorage.setItem('tema-sales', tema)
    }
  }
})
