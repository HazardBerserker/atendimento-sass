import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/styles/global.css'
import vuetify from '@/plugins/vuetify';
import { i18n } from '@/plugins/i18n'
import BaseSwitch from '@/modulos/Shared/Components/UI/BaseSwitch.vue'
import mitt from 'mitt';
// import { createEchoInstance } from './plugins/echo'
import {mask} from 'vue-the-mask'
import { VueMaskFilter } from 'v-mask';
import money from 'v-money3'

import proj4 from 'proj4';
window.proj4 = proj4;
import * as Highcharts from 'highcharts/highmaps';
import HighchartsVue from 'highcharts-vue';
import mapData from '@highcharts/map-collection/countries/br/br-all.geo.json';
import { hydrationPlugin } from './modulos/Shared/Domain/Stores/hydratationPlugin'
import { inicializarPwa } from '@/modulos/Shared/Domain/Services/pwaService'
// Inicializa o módulo
Highcharts.setOptions({
  lang: {
    decimalPoint: ',',
    thousandsSep: '.',
    locale: 'pt-BR',
    loading: 'Carregando...',
    noData: 'Sem dados para exibir'
  },
  accessibility: {
    enabled: false
  }
});
Highcharts.maps['countries/br/br-all'] = mapData;
// Carrega os dados do GeoJSON


// GERENCIAMENTO DO ESTADO
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(hydrationPlugin)

const app = createApp(App)

// Componentes próprios (não-Vuetify) registrados globalmente
app.component('BaseSwitch', BaseSwitch)

// diretivas
app.directive('mask', mask);

// emitter - para comunicação entre componentes
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.config.globalProperties.$VMask = (value, pattern) => {
  return VueMaskFilter(value, pattern);
};

// Inicializa Echo e disponibiliza globalmente
// const echoInstance = createEchoInstance();
// app.config.globalProperties.$echo = echoInstance;
// app.provide("echo", echoInstance);

// plugins
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(vuetify)
app.use(money)
app.use(HighchartsVue, { highcharts: Highcharts })

app.mount('#app')

// PWA — registra service worker e prepara instalação (somente em produção
// para não interferir no hot-reload do ambiente de desenvolvimento)
if (import.meta.env.PROD) {
  inicializarPwa()
}
