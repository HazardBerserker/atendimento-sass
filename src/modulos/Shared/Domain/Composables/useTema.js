import vuetify from '@/plugins/vuetify'
import { useTemaStore } from '@/modulos/Shared/Domain/Stores/useTemaStore'

export function useTema() {
  const store = useTemaStore()

  const temas = {
    dark: 'darkTheme',
    light: 'lightTheme'
  }

  function alternarTema() {
    const temaAtual = vuetify.theme.global.name.value
    const novoTema = temaAtual === temas.dark ? temas.light : temas.dark

    vuetify.theme.global.name.value = novoTema
    store.setTema(novoTema === temas.dark ? 'dark' : 'light')
  }

  function definirTemaInicial() {
    const temaDoStorage = store.temaAtual
    vuetify.theme.global.name.value = temaDoStorage === 'light' ? temas.light : temas.dark
  }

  return {
    alternarTema,
    definirTemaInicial
  }
}
