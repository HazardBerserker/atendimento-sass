/**
 * Service para cálculo de métricas de atendimentos
 */
export class MetricasService {
  /**
   * Converte string 'YYYY-MM-DD' para Date local (meio-dia) evitando shift de timezone
   */
  static parseDataLocal(dataStr) {
    const [y, m, d] = dataStr.split('-').map(Number)
    return new Date(y, m - 1, d, 12, 0, 0)
  }

  /**
   * Calcula total de atendimentos em um período
   */
  static getTotalAtendimentosPorPeriodo(atendimentos, dataInicio, dataFim) {
    return atendimentos.filter(atendimento => {
      const data = this.parseDataLocal(atendimento.data)
      return data >= dataInicio && data <= dataFim
    }).length
  }

  /**
   * Calcula total de atendimentos do mês atual
   */
  static getTotalMesAtual(atendimentos) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    return this.getTotalAtendimentosPorPeriodo(atendimentos, inicioMes, fimMes)
  }

  /**
   * Calcula total de atendimentos do próximo mês
   */
  static getTotalProximoMes(atendimentos) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0)

    return this.getTotalAtendimentosPorPeriodo(atendimentos, inicioMes, fimMes)
  }

  /**
   * Calcula total de atendimentos do mês passado
   */
  static getTotalMesPassado(atendimentos) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0)

    return this.getTotalAtendimentosPorPeriodo(atendimentos, inicioMes, fimMes)
  }

  /**
   * Calcula total de atendimentos da semana atual
   */
  static getTotalSemanaAtual(atendimentos) {
    const hoje = new Date()
    const diaSemana = hoje.getDay()
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - diaSemana)
    inicioSemana.setHours(0, 0, 0, 0)

    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 6)
    fimSemana.setHours(23, 59, 59, 999)

    return this.getTotalAtendimentosPorPeriodo(atendimentos, inicioSemana, fimSemana)
  }

  /**
   * Calcula total de atendimentos com sinal pago
   */
  static getTotalSinalPago(atendimentos) {
    return atendimentos.filter(a => a.sinalPago).length
  }

  /**
   * Calcula total de atendimentos com sinal não pago
   */
  static getTotalSinalNaoPago(atendimentos) {
    return atendimentos.filter(a => !a.sinalPago).length
  }

  /**
   * Calcula faturamento total em um período
   */
  static getFaturamentoPorPeriodo(atendimentos, dataInicio, dataFim, apenasSinal = false) {
    return atendimentos
      .filter(atendimento => {
        const data = this.parseDataLocal(atendimento.data)
        return data >= dataInicio && data <= dataFim
      })
      .reduce((total, atendimento) => {
        if (apenasSinal) {
          return total + (atendimento.sinalPago ? parseFloat(atendimento.valorSinal || 0) : 0)
        }
        return total + parseFloat(atendimento.valor || 0)
      }, 0)
  }

  /**
   * Calcula faturamento do mês atual
   */
  static getFaturamentoMesAtual(atendimentos) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    return this.getFaturamentoPorPeriodo(atendimentos, inicioMes, fimMes)
  }

  /**
   * Calcula total de sinais recebidos no mês
   */
  static getTotalSinaisRecebidos(atendimentos) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    return this.getFaturamentoPorPeriodo(atendimentos, inicioMes, fimMes, true)
  }

  /**
   * Calcula taxa de conversão de sinal
   */
  static getTaxaConversaoSinal(atendimentos) {
    const total = atendimentos.length
    if (total === 0) return 0

    const comSinal = this.getTotalSinalPago(atendimentos)
    return ((comSinal / total) * 100).toFixed(1)
  }

  /**
   * Calcula crescimento comparado ao mês anterior
   */
  static getCrescimentoMensal(atendimentos) {
    const mesAtual = this.getTotalMesAtual(atendimentos)
    const mesPassado = this.getTotalMesPassado(atendimentos)

    if (mesPassado === 0) return mesAtual > 0 ? 100 : 0

    return (((mesAtual - mesPassado) / mesPassado) * 100).toFixed(1)
  }

  /**
   * Retorna faturamento realizado agrupado por mês (histórico completo)
   */
  static getFaturamentoRealizadoPorMes(atendimentos) {
    const porMes = {}

    // Status realizado: conta valor total
    atendimentos
      .filter(a => a.status === 'realizado')
      .forEach(a => {
        const [ano, mes] = a.data.split('-').map(Number)
        const chave = `${ano}-${String(mes).padStart(2, '0')}`
        if (!porMes[chave]) {
          porMes[chave] = { ano, mes, valorRealizado: 0, valorSinais: 0, quantidade: 0 }
        }
        porMes[chave].valorRealizado += Number(a.valor) || 0
        porMes[chave].quantidade++
      })

    // Sinais pagos de agendados/confirmados (dinheiro já recebido)
    atendimentos
      .filter(a => a.sinalPago && (a.status === 'agendado' || a.status === 'confirmado'))
      .forEach(a => {
        const [ano, mes] = a.data.split('-').map(Number)
        const chave = `${ano}-${String(mes).padStart(2, '0')}`
        if (!porMes[chave]) {
          porMes[chave] = { ano, mes, valorRealizado: 0, valorSinais: 0, quantidade: 0 }
        }
        porMes[chave].valorSinais += Number(a.valorSinal) || 0
      })

    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    const resultado = Object.values(porMes)
      .map(item => ({
        ...item,
        total: item.valorRealizado + item.valorSinais,
        label: `${mesesNomes[item.mes - 1]}/${item.ano}`,
        variacao: null
      }))
      .sort((a, b) => b.ano !== a.ano ? b.ano - a.ano : b.mes - a.mes)

    // Calcula variação vs. mês anterior exato
    for (let i = 0; i < resultado.length; i++) {
      const atual = resultado[i]
      const mesAnteriorAno = atual.mes === 1 ? atual.ano - 1 : atual.ano
      const mesAnteriorMes = atual.mes === 1 ? 12 : atual.mes - 1
      const anterior = resultado.find(r => r.ano === mesAnteriorAno && r.mes === mesAnteriorMes)
      if (anterior && anterior.total > 0) {
        atual.variacao = ((atual.total - anterior.total) / anterior.total * 100)
      }
    }

    return resultado
  }

  /**
   * Calcula métricas financeiras e operacionais para um conjunto (já filtrado) de atendimentos
   */
  static getMetricasFiltradas(atendimentos) {
    const realizados = atendimentos
      .filter(a => a.status === 'realizado')
      .reduce((t, a) => t + (Number(a.valor) || 0), 0)

    const sinaisPagosNaoRealizados = atendimentos
      .filter(a => a.sinalPago && (a.status === 'agendado' || a.status === 'confirmado'))
      .reduce((t, a) => t + (Number(a.valorSinal) || 0), 0)

    const previsto = atendimentos
      .filter(a => a.status === 'agendado' || a.status === 'confirmado')
      .reduce((t, a) => t + (Number(a.valor) || 0), 0)

    const cancelado = atendimentos
      .filter(a => a.status === 'cancelado')
      .reduce((t, a) => t + (Number(a.valor) || 0), 0)

    const totalSinais = atendimentos
      .filter(a => a.sinalPago && a.status !== 'cancelado')
      .reduce((t, a) => t + (Number(a.valorSinal) || 0), 0)

    const total = atendimentos
      .filter(a => a.status !== 'cancelado')
      .reduce((t, a) => t + (Number(a.valor) || 0), 0)

    const sinalPago = atendimentos.filter(a => a.sinalPago).length
    const taxaConversao = atendimentos.length > 0
      ? ((sinalPago / atendimentos.length) * 100).toFixed(1)
      : '0.0'

    return {
      totalAtendimentos: atendimentos.length,
      faturamentoRealizado: realizados + sinaisPagosNaoRealizados,
      faturamentoPrevisto: previsto,
      faturamentoCancelado: cancelado,
      totalSinaisRecebidos: totalSinais,
      faturamentoTotal: total,
      saldoAReceber: previsto - totalSinais,
      totalSinalPago: sinalPago,
      totalSinalNaoPago: atendimentos.filter(a => !a.sinalPago).length,
      taxaConversaoSinal: taxaConversao
    }
  }

  /**
   * Retorna todas as métricas de uma vez
   */
  static getAllMetricas(atendimentos) {
    return {
      totalMesAtual: this.getTotalMesAtual(atendimentos),
      totalProximoMes: this.getTotalProximoMes(atendimentos),
      totalMesPassado: this.getTotalMesPassado(atendimentos),
      totalSemanaAtual: this.getTotalSemanaAtual(atendimentos),
      totalSinalPago: this.getTotalSinalPago(atendimentos),
      totalSinalNaoPago: this.getTotalSinalNaoPago(atendimentos),
      faturamentoMesAtual: this.getFaturamentoMesAtual(atendimentos),
      totalSinaisRecebidos: this.getTotalSinaisRecebidos(atendimentos),
      taxaConversaoSinal: this.getTaxaConversaoSinal(atendimentos),
      crescimentoMensal: this.getCrescimentoMensal(atendimentos)
    }
  }
}
