import { defineStore } from 'pinia'

/**
 * Dados do estúdio/negócio. Usado no cabeçalho e na tela de
 * Configurações. Persistido localmente.
 */
export const usePerfilNegocioStore = defineStore('perfilNegocio', {
  state: () => ({
    nomeEstudio: 'Estética Pro',
    profissional: 'Raiany',
    telefone: '',
    endereco: '',
    instagram: '',
  }),

  actions: {
    atualizar(dados) {
      Object.assign(this.$state, dados)
    },
  },

  persist: {
    key: 'perfil-negocio-store',
    storage: localStorage,
  },
})
