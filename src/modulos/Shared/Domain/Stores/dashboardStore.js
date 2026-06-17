// src/stores/chatStore.js
import { defineStore } from "pinia";


export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    upkPlanoDeVendas: {
      cardsOcultos: true,
      tabelaOculta: true,
      dashboardOculto: false,
      visualizacaoOculta: false
    },
    garantiaAFTMKT: {
      cardsOcultos: true,
      tabelaOculta: true,
      dashboardOculto: false,
      visualizacaoOculta: false
    },
    frotaDadosGerais: {
      cardsOcultos: true,
      tabelaOculta: true,
      dashboardOculto: false,
      visualizacaoOculta: false
    },
  }),
  persist: true,

});
