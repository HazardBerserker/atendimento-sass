
import { computed } from 'vue'
import vuetify from '@/plugins/vuetify'

export function useCoresDoTema() {
  // Utilizando acesso direto ao tema, como no useTema.js, para garantir clareza e reatividade
  const corDoFundo = computed(() => {
    const temaAtual = vuetify.theme.global.name.value
    return temaAtual === 'darkTheme' ? '#091421' : '#D9E4EF'
  })

  const corInvertidaParaOFundo = computed(() => {
    const temaAtual = vuetify.theme.global.name.value
    return temaAtual === 'darkTheme' ? '#D9E4EF' : '#091421'
  })

  const corDaLinhaDosCards = computed(() => {
    const temaAtual = vuetify.theme.global.name.value
    return temaAtual === 'darkTheme' ? '#243750' : '#ADBACB'
  })

  return { corDoFundo, corInvertidaParaOFundo, corDaLinhaDosCards }
}
