/**
 * Service para gerenciamento de atendimentos
 */
export class AtendimentoService {
  /**
   * Gera um ID único para um novo atendimento
   */
  static gerarId() {
    return `atd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Cria um novo atendimento com valores padrão
   */
  static criarAtendimento(dados) {
    return {
      id: this.gerarId(),
      cliente: dados.nomeCompleto,
      telefone: dados.telefone,
      email: dados.email || '',
      procedimento: dados.procedimento,
      valor: parseFloat(dados.valor),
      sinalPago: dados.sinalPago || false,
      valorSinal: dados.sinalPago ? parseFloat(dados.valorSinal) : 0,
      data: dados.data,
      hora: dados.hora,
      status: 'agendado',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
  }

  /**
   * Atualiza o status de um atendimento
   */
  static atualizarStatus(atendimento, novoStatus) {
    return {
      ...atendimento,
      status: novoStatus,
      atualizadoEm: new Date().toISOString()
    }
  }

  /**
   * Filtra atendimentos por status
   */
  static filtrarPorStatus(atendimentos, status) {
    return atendimentos.filter(a => a.status === status)
  }

  /**
   * Filtra atendimentos por data
   */
  static filtrarPorData(atendimentos, data) {
    // Compara strings diretamente para evitar problemas de timezone
    const dataStr = typeof data === 'string' ? data : `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`
    return atendimentos.filter(a => a.data === dataStr)
  }

  /**
   * Filtra atendimentos por período
   */
  static filtrarPorPeriodo(atendimentos, dataInicio, dataFim) {
    return atendimentos.filter(a => {
      const [y, m, d] = a.data.split('-').map(Number)
      const data = new Date(y, m - 1, d, 12, 0, 0)
      return data >= dataInicio && data <= dataFim
    })
  }

  /**
   * Ordena atendimentos por data e hora
   */
  static ordenarPorDataHora(atendimentos, ordem = 'asc') {
    return [...atendimentos].sort((a, b) => {
      const dataHoraA = new Date(`${a.data}T${a.hora}`)
      const dataHoraB = new Date(`${b.data}T${b.hora}`)

      return ordem === 'asc'
        ? dataHoraA - dataHoraB
        : dataHoraB - dataHoraA
    })
  }

  /**
   * Busca atendimentos por nome do cliente
   */
  static buscarPorCliente(atendimentos, termo) {
    const termoLower = termo.toLowerCase()
    return atendimentos.filter(a =>
      a.cliente.toLowerCase().includes(termoLower)
    )
  }

  /**
   * Valida os dados de um atendimento
   */
  static validarAtendimento(dados) {
    const erros = []

    if (!dados.nomeCompleto || dados.nomeCompleto.trim() === '') {
      erros.push('Nome completo é obrigatório')
    }

    if (!dados.telefone || dados.telefone.trim() === '') {
      erros.push('Telefone é obrigatório')
    }

    if (!dados.procedimento) {
      erros.push('Procedimento é obrigatório')
    }

    if (!dados.valor || parseFloat(dados.valor) <= 0) {
      erros.push('Valor deve ser maior que zero')
    }

    if (dados.sinalPago && (!dados.valorSinal || parseFloat(dados.valorSinal) <= 0)) {
      erros.push('Valor do sinal deve ser maior que zero')
    }

    if (dados.sinalPago && parseFloat(dados.valorSinal) > parseFloat(dados.valor)) {
      erros.push('Valor do sinal não pode ser maior que o valor total')
    }

    if (!dados.data) {
      erros.push('Data é obrigatória')
    }

    if (!dados.hora) {
      erros.push('Horário é obrigatório')
    }

    return {
      valido: erros.length === 0,
      erros
    }
  }
}
