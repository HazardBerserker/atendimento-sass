import { defineStore } from 'pinia'
import ApiService from '@/modulos/Shared/Domain/Services/ApiService'
import router from '@/router'
import { useLoadingStore } from './loading'
import { SimENaoEnumDescricao } from '@/modulos/Shared/Domain/Enums/SimENaoEnum'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    returnUrl: null,
    isHydrated: false // <- nova flag
  }),
  persist: true,

  getters: {
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    async login(credentials) {
      try {
        await ApiService.get('/sanctum/csrf-cookie', {
          baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
          withCredentials: true
        })

        const res = await ApiService.post('/login', credentials)

        if (res.status === 200 && res.data.success && res.data.data) {
          const { user_data } = res.data.data
          this.user = user_data
          this.returnUrl = null
          return res
        }
      } catch (error) {
        this.user = null
        throw error
      }
    },

    // faz uma requisição buscando o proprio usuario, poderia ser qualquer rota
    // optei pela mais performatica e com mais semântica
    async verificaSeEstaLogado() {
      // const endpoint = `${endpoints.usuario.busca}/${this.user.id_usuario}`;
      try {
        // const resposta = await ApiService({
        //   method: 'get',
        //   url: endpoint,
        // });
        // if(resposta) {
        //   return true
        // }
      } catch (erro) {
        if(erro.status === 401) {
          return false
        }
        return true
      }
    },

    async logout() {
      const loading = useLoadingStore()
      try {
        loading.show('Deslogando Usuário...')
        await ApiService.post('/logout')
      } catch (e) {
        console.warn('Erro ao fazer logout no servidor (ignorado):', e)
      } finally {
        this.user = null
        router.push({ name: 'login' })
        loading.hide()
      }
    },

    usuarioLogadoEhAdmin() {
      return this.user.is_super_admin == SimENaoEnumDescricao.SIM || this.user.is_admin == SimENaoEnumDescricao.SIM
    }
  }
})
