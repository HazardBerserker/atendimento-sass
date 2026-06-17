import { defineStore } from "pinia";

export const useMoedaStore = defineStore("moeda", {
  state: () => ({
    moedaAtual: 'BRL',
  }),
  persist: true,
})
