import { defineStore } from 'pinia'
import { AtendimentoService } from '../Services/AtendimentoService'
import { MetricasService } from '../Services/MetricasService'

export const useAtendimentoStore = defineStore('atendimento', {
  state: () => ({
    atendimentos: [],
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Retorna todas as métricas calculadas
     */
    metricas: (state) => {
      return MetricasService.getAllMetricas(state.atendimentos)
    },

    /**
     * Filtra atendimentos por status
     */
    atendimentosPorStatus: (state) => (status) => {
      return AtendimentoService.filtrarPorStatus(state.atendimentos, status)
    },

    /**
     * Retorna atendimentos ordenados por data/hora
     */
    atendimentosOrdenados: (state) => {
      return AtendimentoService.ordenarPorDataHora(state.atendimentos, 'asc')
    },

    /**
     * Calcula faturamento previsto (agendado + confirmado)
     * Não inclui cancelados nem realizados
     */
    faturamentoPrevisto(state) {
      return state.atendimentos
        .filter(a => a.status === 'agendado' || a.status === 'confirmado')
        .reduce((total, a) => total + (Number(a.valor) || 0), 0)
    },

    /**
     * Calcula faturamento realizado
     * Inclui: valor total dos realizados + sinais pagos de agendado/confirmado
     * Sinal pago = dinheiro que já entrou e não volta
     */
    faturamentoRealizado(state) {
      const valorRealizados = state.atendimentos
        .filter(a => a.status === 'realizado')
        .reduce((total, a) => total + (Number(a.valor) || 0), 0)

      const sinaisPagosNaoRealizados = state.atendimentos
        .filter(a => a.sinalPago && (a.status === 'agendado' || a.status === 'confirmado'))
        .reduce((total, a) => total + (Number(a.valorSinal) || 0), 0)

      return valorRealizados + sinaisPagosNaoRealizados
    },

    /**
     * Calcula faturamento cancelado
     */
    faturamentoCancelado(state) {
      return state.atendimentos
        .filter(a => a.status === 'cancelado')
        .reduce((total, a) => total + (Number(a.valor) || 0), 0)
    },

    /**
     * Calcula total de sinais recebidos (automaticamente considerado realizado)
     * Apenas sinais pagos, exceto de atendimentos cancelados
     */
    totalSinaisRecebidos(state) {
      return state.atendimentos
        .filter(a => a.sinalPago && a.status !== 'cancelado')
        .reduce((total, a) => total + (Number(a.valorSinal) || 0), 0)
    },

    /**
     * Calcula faturamento total (previsto + realizado)
     * Não inclui cancelados
     */
    faturamentoTotal(state) {
      return state.atendimentos
        .filter(a => a.status !== 'cancelado')
        .reduce((total, a) => total + (Number(a.valor) || 0), 0)
    },

    /**
     * Calcula saldo a receber (faturamento previsto - sinais já recebidos)
     */
    saldoAReceber() {
      return this.faturamentoPrevisto - this.totalSinaisRecebidos
    }
  },

  actions: {
    /**
     * Carrega os atendimentos (mock ou API)
     */
    async carregarAtendimentos() {
      this.loading = true
      this.error = null

      try {
        // TODO: Substituir por chamada real à API
        // const response = await api.get('/atendimentos')
        // this.atendimentos = response.data

        // Se já tiver dados no persist (localStorage), não sobrescreve
        if (!this.atendimentos || this.atendimentos.length === 0) {
          this.atendimentos = []
        }

        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
        throw error
      }
    },

    /**
     * Cria um novo atendimento
     */
    async criarAtendimento(dados) {
      this.loading = true
      this.error = null

      try {
        const validacao = AtendimentoService.validarAtendimento(dados)

        if (!validacao.valido) {
          throw new Error(validacao.erros.join(', '))
        }

        const novoAtendimento = AtendimentoService.criarAtendimento(dados)

        // TODO: Salvar no backend
        // const response = await api.post('/atendimentos', novoAtendimento)
        // this.atendimentos.push(response.data)

        this.atendimentos.push(novoAtendimento)
        this.loading = false

        return novoAtendimento
      } catch (error) {
        this.error = error.message
        this.loading = false
        throw error
      }
    },

    /**
     * Atualiza o status de um atendimento
     * Quando cancelado, automaticamente atualiza o faturamento
     */
    async atualizarStatus(atendimentoId, novoStatus) {
      this.loading = true
      this.error = null

      try {
        const index = this.atendimentos.findIndex(a => a.id === atendimentoId)

        if (index === -1) {
          throw new Error('Atendimento não encontrado')
        }

        const atendimentoAtual = this.atendimentos[index]
        const atendimentoAtualizado = AtendimentoService.atualizarStatus(
          atendimentoAtual,
          novoStatus
        )

        // TODO: Atualizar no backend
        // await api.patch(`/atendimentos/${atendimentoId}`, { status: novoStatus })

        this.atendimentos[index] = atendimentoAtualizado
        this.loading = false

        // O faturamento é recalculado automaticamente pelos getters
        return atendimentoAtualizado
      } catch (error) {
        this.error = error.message
        this.loading = false
        throw error
      }
    },

    /**
     * Edita um atendimento existente (todos os campos)
     * Permite alterar status, sinalPago, horários etc.
     */
    async editarAtendimento(atendimentoId, dados) {
      this.loading = true
      this.error = null

      try {
        const index = this.atendimentos.findIndex(a => a.id === atendimentoId)

        if (index === -1) {
          throw new Error('Atendimento não encontrado')
        }

        const atendimentoAtual = this.atendimentos[index]

        const atendimentoAtualizado = {
          ...atendimentoAtual,
          cliente: dados.nomeCompleto || atendimentoAtual.cliente,
          telefone: dados.telefone || atendimentoAtual.telefone,
          email: dados.email || atendimentoAtual.email,
          procedimento: dados.procedimento || atendimentoAtual.procedimento,
          valor: Number(dados.valor) || atendimentoAtual.valor,
          sinalPago: dados.sinalPago ?? atendimentoAtual.sinalPago,
          valorSinal: dados.sinalPago ? (Number(dados.valorSinal) || 0) : 0,
          data: dados.data || atendimentoAtual.data,
          hora: dados.hora || atendimentoAtual.hora,
          status: dados.status || atendimentoAtual.status,
          atualizadoEm: new Date().toISOString()
        }

        // TODO: Atualizar no backend
        // await api.put(`/atendimentos/${atendimentoId}`, atendimentoAtualizado)

        this.atendimentos[index] = atendimentoAtualizado
        this.loading = false

        return atendimentoAtualizado
      } catch (error) {
        this.error = error.message
        this.loading = false
        throw error
      }
    },

    /**
     * Remove um atendimento
     */
    async removerAtendimento(atendimentoId) {
      this.loading = true
      this.error = null

      try {
        // TODO: Remover do backend
        // await api.delete(`/atendimentos/${atendimentoId}`)

        const index = this.atendimentos.findIndex(a => a.id === atendimentoId)
        if (index !== -1) {
          this.atendimentos.splice(index, 1)
        }

        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
        throw error
      }
    },

    /**
     * Busca atendimentos por cliente
     */
    buscarPorCliente(termo) {
      return AtendimentoService.buscarPorCliente(this.atendimentos, termo)
    },

    /**
     * Exporta todos os atendimentos como JSON (download)
     */
    exportarBackup() {
      const backup = {
        versao: '1.0',
        exportadoEm: new Date().toISOString(),
        totalAtendimentos: this.atendimentos.length,
        atendimentos: this.atendimentos
      }

      const json = JSON.stringify(backup, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const hoje = new Date()
      const dataStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
      const nomeArquivo = `backup-atendimentos-${dataStr}.json`

      const link = document.createElement('a')
      link.href = url
      link.download = nomeArquivo
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },

    /**
     * Importa atendimentos de um arquivo JSON de backup
     * @param {File} arquivo - O arquivo JSON selecionado
     * @returns {Promise<{importados: number, total: number}>}
     */
    async importarBackup(arquivo) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const conteudo = JSON.parse(e.target.result)

            // Valida estrutura do backup
            let atendimentos = []
            if (conteudo.atendimentos && Array.isArray(conteudo.atendimentos)) {
              atendimentos = conteudo.atendimentos
            } else if (Array.isArray(conteudo)) {
              atendimentos = conteudo
            } else {
              throw new Error('Formato de backup inválido')
            }

            // Valida que cada item tem campos mínimos
            const validos = atendimentos.filter(a =>
              a.cliente && a.data && a.hora && a.procedimento
            )

            if (validos.length === 0) {
              throw new Error('Nenhum atendimento válido encontrado no backup')
            }

            // Substitui todos os atendimentos
            this.atendimentos = validos

            resolve({
              importados: validos.length,
              total: atendimentos.length
            })
          } catch (error) {
            reject(new Error(`Erro ao ler backup: ${error.message}`))
          }
        }

        reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
        reader.readAsText(arquivo)
      })
    },

    /**
     * Limpa todos os atendimentos
     */
    limparTodos() {
      this.atendimentos = []
    }
  },

  // Persiste o estado no localStorage
  persist: {
    key: 'atendimento-store',
    storage: localStorage,
    paths: ['atendimentos']
  }
})
