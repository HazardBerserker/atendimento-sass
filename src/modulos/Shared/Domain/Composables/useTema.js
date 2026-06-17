import vuetify from '@/plugins/vuetify'
import { useTemaStore } from '@/modulos/Shared/Domain/Stores/useTemaStore'

export function useTema() {
  const store = useTemaStore()

  const temas = {
    dark: 'darkTheme',
    light: 'lightTheme'
  }

  // Mantém o data-theme no <html> em sincronia para as variáveis CSS próprias
  function sincronizarAtributo(tema) {
    document.documentElement.setAttribute('data-theme', tema)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', tema === 'dark' ? '#1E1A17' : '#C57F4B')
  }

  function alternarTema() {
    const temaAtual = vuetify.theme.global.name.value
    const novoTema = temaAtual === temas.dark ? temas.light : temas.dark

    vuetify.theme.global.name.value = novoTema
    const chave = novoTema === temas.dark ? 'dark' : 'light'
    store.setTema(chave)
    sincronizarAtributo(chave)
  }

  function definirTemaInicial() {
    const temaDoStorage = store.temaAtual
    vuetify.theme.global.name.value = temaDoStorage === 'light' ? temas.light : temas.dark
    sincronizarAtributo(temaDoStorage === 'light' ? 'light' : 'dark')
  }

  return {
    alternarTema,
    definirTemaInicial
  }
}
