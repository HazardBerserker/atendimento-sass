import { defineStore } from "pinia";

export const useIdiomaStore = defineStore("idioma", {
  state: () => ({
    idiomaAtual: 'pt',
  }),
  persist: true,
})
