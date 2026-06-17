import { createI18n } from 'vue-i18n'

const idiomaSalvo = JSON.parse(localStorage.getItem('idioma'))?.idiomaAtual;

export const i18n = createI18n({
  legacy: true, // habilita Options API
  globalInjection: true,
  locale: idiomaSalvo, // idioma inicial
  fallbackLocale: 'pt',
  messages: {}
})
