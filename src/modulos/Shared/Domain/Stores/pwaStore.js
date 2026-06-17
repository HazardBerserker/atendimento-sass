import { defineStore } from 'pinia'

/**
 * Estado do PWA: disponibilidade de instalação (Add to Home Screen),
 * atualização disponível e modo standalone (rodando como app).
 */
export const usePwaStore = defineStore('pwa', {
  state: () => ({
    deferredPrompt: null,   // evento beforeinstallprompt guardado
    podeInstalar: false,    // há prompt nativo disponível
    temAtualizacao: false,  // novo SW aguardando
    standalone: false,      // já está rodando como app instalado
    iosBannerVisto: false,  // usuário já dispensou a dica do iOS
    _swWaiting: null,       // referência ao SW em espera
  }),

  getters: {
    // iOS não dispara beforeinstallprompt — detectamos para mostrar dica manual
    ehIOS: () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream,
    deveMostrarDicaIOS(state) {
      return this.ehIOS && !state.standalone && !state.iosBannerVisto
    },
  },

  actions: {
    detectarStandalone() {
      this.standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    },
    guardarPrompt(evento) {
      this.deferredPrompt = evento
      this.podeInstalar = true
    },
    async instalar() {
      if (!this.deferredPrompt) return false
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice
      this.deferredPrompt = null
      this.podeInstalar = false
      return outcome === 'accepted'
    },
    marcarAtualizacao(swWaiting) {
      this._swWaiting = swWaiting
      this.temAtualizacao = true
    },
    aplicarAtualizacao() {
      if (this._swWaiting) this._swWaiting.postMessage('SKIP_WAITING')
      this.temAtualizacao = false
    },
    dispensarIOS() {
      this.iosBannerVisto = true
    },
  },

  persist: {
    key: 'pwa-store',
    storage: localStorage,
    paths: ['iosBannerVisto'],
  },
})
