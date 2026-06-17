import { defineStore } from 'pinia'

/**
 * Catálogo de procedimentos (serviços) do estúdio.
 * Antes os valores eram fixos dentro do formulário — agora ficam
 * centralizados aqui e podem ser editados na tela de Configurações.
 */
const PROCEDIMENTOS_PADRAO = [
  { id: 'proc_volume_br',       nome: 'Volume Brasileiro',        valor: 145, duracao: 120, ativo: true },
  { id: 'proc_volume_br_marrom', nome: 'Volume Brasileiro Marrom', valor: 145, duracao: 120, ativo: true },
  { id: 'proc_glamour',         nome: 'Glamour',                  valor: 180, duracao: 150, ativo: true },
  { id: 'proc_molhado',         nome: 'Efeito Molhado',           valor: 155, duracao: 120, ativo: true },
  { id: 'proc_fio_u',           nome: 'Fio U',                    valor: 165, duracao: 130, ativo: true },
  { id: 'proc_fox',             nome: 'Fox',                      valor: 190, duracao: 150, ativo: true },
  { id: 'proc_wispy',           nome: 'Wispy',                    valor: 180, duracao: 140, ativo: true },
]

export const useProcedimentoStore = defineStore('procedimento', {
  state: () => ({
    procedimentos: [...PROCEDIMENTOS_PADRAO],
  }),

  getters: {
    procedimentosAtivos: (state) => state.procedimentos.filter(p => p.ativo),
    totalProcedimentos: (state) => state.procedimentos.length,
    ticketMedioCatalogo: (state) => {
      const ativos = state.procedimentos.filter(p => p.ativo)
      if (!ativos.length) return 0
      return ativos.reduce((t, p) => t + Number(p.valor || 0), 0) / ativos.length
    },
  },

  actions: {
    gerarId() {
      return `proc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    },

    adicionar(dados) {
      this.procedimentos.push({
        id: this.gerarId(),
        nome: dados.nome,
        valor: Number(dados.valor) || 0,
        duracao: Number(dados.duracao) || 60,
        ativo: true,
      })
    },

    editar(id, dados) {
      const idx = this.procedimentos.findIndex(p => p.id === id)
      if (idx === -1) return
      this.procedimentos[idx] = { ...this.procedimentos[idx], ...dados, valor: Number(dados.valor) }
    },

    remover(id) {
      this.procedimentos = this.procedimentos.filter(p => p.id !== id)
    },

    alternarAtivo(id) {
      const p = this.procedimentos.find(x => x.id === id)
      if (p) p.ativo = !p.ativo
    },

    restaurarPadrao() {
      this.procedimentos = [...PROCEDIMENTOS_PADRAO]
    },
  },

  persist: {
    key: 'procedimento-store',
    storage: localStorage,
    paths: ['procedimentos'],
  },
})
