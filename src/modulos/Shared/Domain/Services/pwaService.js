import { usePwaStore } from '@/modulos/Shared/Domain/Stores/pwaStore'

/**
 * Registra o service worker e conecta os eventos de instalação/atualização
 * à store de PWA. Chamado uma vez no bootstrap da aplicação.
 */
export function inicializarPwa() {
  const pwa = usePwaStore()
  pwa.detectarStandalone()

  // Add to Home Screen (Chromium / Android / Desktop)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    pwa.guardarPrompt(e)
  })

  window.addEventListener('appinstalled', () => {
    pwa.podeInstalar = false
    pwa.deferredPrompt = null
    pwa.standalone = true
  })

  // Atualiza flag quando entra/sai do modo standalone
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', () => {
    pwa.detectarStandalone()
  })

  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })

      // Já existe um SW aguardando ao carregar
      if (reg.waiting && navigator.serviceWorker.controller) {
        pwa.marcarAtualizacao(reg.waiting)
      }

      // Novo SW encontrado
      reg.addEventListener('updatefound', () => {
        const novo = reg.installing
        if (!novo) return
        novo.addEventListener('statechange', () => {
          if (novo.state === 'installed' && navigator.serviceWorker.controller) {
            pwa.marcarAtualizacao(reg.waiting || novo)
          }
        })
      })

      // Recarrega quando o novo SW assume o controle
      let recarregando = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (recarregando) return
        recarregando = true
        window.location.reload()
      })
    } catch (err) {
      console.warn('Falha ao registrar o service worker:', err)
    }
  })
}
