<template>
  <div class="atendimento-view">

    <!-- ─── Header ─────────────────────────────────────────────────── -->
    <div class="view-header mb-4">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Gestão de atendimentos e faturamento</p>
      </div>

      <div class="header-actions">
        <button
          class="hbtn hbtn-outline"
          @click="exportarBackup"
          :disabled="atendimentos.length === 0"
        >
          <v-icon size="14">mdi-download-outline</v-icon>
          Exportar
        </button>

        <button class="hbtn hbtn-outline" @click="$refs.fileInput.click()">
          <v-icon size="14">mdi-upload-outline</v-icon>
          Importar
        </button>

        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none;"
          @change="importarBackup"
        />

        <button class="hbtn hbtn-primary" @click="dialogNovoAtendimento = true">
          <v-icon size="16">mdi-plus</v-icon>
          Novo Atendimento
        </button>
      </div>
    </div>

    <!-- ─── Seletor de Período ────────────────────────────────────── -->
    <div class="period-section mb-4">
      <div class="period-bar">
        <div class="period-chips">
          <button
            v-for="p in periodos"
            :key="p.key"
            class="period-chip"
            :class="{ active: periodoAtivo === p.key }"
            @click="periodoAtivo = p.key"
          >
            {{ p.label }}
          </button>
        </div>
        <div class="period-info">
          <v-icon size="14" color="grey">mdi-calendar-range</v-icon>
          <span class="period-label-text">{{ periodoRange.label }}</span>
          <span v-if="atendimentos.length > 0" class="period-count">
            {{ metricasPeriodo.totalAtendimentos }}
            atendimento{{ metricasPeriodo.totalAtendimentos !== 1 ? 's' : '' }} no período
          </span>
        </div>
      </div>
    </div>

    <!-- ─── KPIs Financeiros ──────────────────────────────────────── -->
    <div class="section-label mb-2">Financeiro</div>
    <v-row dense class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Faturamento Realizado"
          :value="metricasPeriodo.faturamentoRealizado"
          icon="mdi-check-circle"
          variant="highlight"
          :is-currency="true"
          subtitle="Procedimentos concluídos + sinais"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Faturamento Previsto"
          :value="metricasPeriodo.faturamentoPrevisto"
          icon="mdi-clock-outline"
          variant="warning"
          :is-currency="true"
          subtitle="Agendado + Confirmado"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Total em Sinais"
          :value="metricasPeriodo.totalSinaisRecebidos"
          icon="mdi-cash-check"
          variant="success"
          :is-currency="true"
          subtitle="Já recebido em sinais"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Saldo a Receber"
          :value="metricasPeriodo.saldoAReceber"
          icon="mdi-cash-clock"
          variant="info"
          :is-currency="true"
          subtitle="Previsto − Sinais recebidos"
        />
      </v-col>
    </v-row>

    <!-- ─── KPIs Operacionais ─────────────────────────────────────── -->
    <div class="section-label mb-2">Operacional</div>
    <v-row dense class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Atendimentos"
          :value="metricasPeriodo.totalAtendimentos"
          icon="mdi-calendar-month"
          variant="default"
          :badge="crescimentoBadge"
          :badge-color="crescimentoBadgeColor"
          subtitle="Total no período selecionado"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Sinal Pago"
          :value="metricasPeriodo.totalSinalPago"
          icon="mdi-cash-fast"
          variant="success"
          :subtitle="`${metricasPeriodo.taxaConversaoSinal}% de conversão`"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Faturamento Total"
          :value="metricasPeriodo.faturamentoTotal"
          icon="mdi-chart-line"
          variant="default"
          :is-currency="true"
          subtitle="Excluindo cancelados"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Cancelados"
          :value="metricasPeriodo.faturamentoCancelado"
          icon="mdi-close-circle-outline"
          variant="danger"
          :is-currency="true"
          subtitle="Faturamento perdido"
        />
      </v-col>
    </v-row>

    <!-- ─── Detalhamento Mensal ───────────────────────────────────── -->
    <div class="monthly-section mb-6">
      <div class="section-header mb-3">
        <div>
          <div class="section-title">Faturamento Realizado</div>
          <div class="section-subtitle">Detalhamento mensal completo</div>
        </div>
        <div class="highlight-pill">
          <v-icon size="14" color="rosaAcento">mdi-trending-up</v-icon>
          Histórico
        </div>
      </div>

      <div v-if="faturamentoMensal.length === 0" class="empty-monthly">
        <v-icon size="40" color="grey-lighten-1">mdi-chart-bar</v-icon>
        <p>Nenhum faturamento realizado registrado ainda.</p>
        <span>Crie atendimentos e marque como "Realizado" para ver o histórico aqui.</span>
      </div>

      <div v-else class="monthly-table-wrap">
        <table class="monthly-table">
          <thead>
            <tr>
              <th class="col-mes">Mês</th>
              <th class="col-qtd">Atend.</th>
              <th class="col-valor">Faturamento Realizado</th>
              <th class="col-bar"></th>
              <th class="col-var">vs. Anterior</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in faturamentoMensal"
              :key="item.label"
              :class="{ 'row-current': isCurrentMonth(item), 'row-stripe': idx % 2 !== 0 }"
            >
              <td class="col-mes">
                <span class="mes-label">{{ item.label }}</span>
                <span v-if="isCurrentMonth(item)" class="current-badge">atual</span>
              </td>
              <td class="col-qtd">
                <span class="qtd-value">{{ item.quantidade }}</span>
              </td>
              <td class="col-valor">
                <span class="valor-realizado">{{ formatCurrency(item.total) }}</span>
              </td>
              <td class="col-bar">
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar-fill"
                    :style="{ width: melhorMes > 0 ? (item.total / melhorMes * 100) + '%' : '0%' }"
                  ></div>
                </div>
              </td>
              <td class="col-var">
                <span v-if="item.variacao !== null" class="variacao" :class="variacaoClass(item.variacao)">
                  <v-icon size="13">{{ item.variacao >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                  {{ Math.abs(item.variacao).toFixed(1) }}%
                </span>
                <span v-else class="variacao-null">—</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td class="col-mes">Total</td>
              <td class="col-qtd">{{ totalQuantidade }}</td>
              <td class="col-valor">{{ formatCurrency(totalFaturado) }}</td>
              <td class="col-bar"></td>
              <td class="col-var"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ─── Controles de Visualização ────────────────────────────── -->
    <div class="section-header mb-3">
      <div>
        <div class="section-title">Agendamentos</div>
        <div class="section-subtitle">Visualize e gerencie seus atendimentos</div>
      </div>
      <div class="view-toggle">
        <button
          class="view-toggle-btn"
          :class="{ active: visualizacao === 'calendario' }"
          @click="visualizacao = 'calendario'"
        >
          <v-icon size="15">mdi-calendar</v-icon>
          Calendário
        </button>
        <button
          class="view-toggle-btn"
          :class="{ active: visualizacao === 'kanban' }"
          @click="visualizacao = 'kanban'"
        >
          <v-icon size="15">mdi-view-column</v-icon>
          Kanban
        </button>
      </div>
    </div>

    <!-- Visualização Calendário -->
    <div v-if="visualizacao === 'calendario'" class="content-view">
      <AtendimentoCalendar
        :atendimentos="atendimentos"
        @dia-click="handleDiaClick"
        @evento-click="handleEventoClick"
      />
    </div>

    <!-- Visualização Kanban -->
    <div v-if="visualizacao === 'kanban'" class="content-view">
      <AtendimentoKanban
        :atendimentos="atendimentos"
        @update-status="handleUpdateStatus"
        @card-click="handleCardClick"
      />
    </div>

    <!-- Dialogs -->
    <AtendimentoDialog
      v-model="dialogNovoAtendimento"
      :data-selecionada="dataSelecionada"
      @save="handleSalvarAtendimento"
    />

    <AtendimentoDialog
      v-model="dialogEditarAtendimento"
      :atendimento="atendimentoSelecionado"
      @save="handleEditarAtendimento"
    />
  </div>
</template>

<script>
import MetricCard from '@/modulos/Atendimento/Components/MetricCard.vue'
import AtendimentoDialog from '@/modulos/Atendimento/Components/AtendimentoDialog.vue'
import AtendimentoCalendar from '@/modulos/Atendimento/Components/AtendimentoCalendar.vue'
import AtendimentoKanban from '@/modulos/Atendimento/Components/AtendimentoKanban.vue'
import { useAtendimentoStore } from '@/modulos/Atendimento/Domain/Stores/atendimentoStore'
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore'
import { MetricasService } from '@/modulos/Atendimento/Domain/Services/MetricasService'

export default {
  name: 'AtendimentoView',
  components: { MetricCard, AtendimentoDialog, AtendimentoCalendar, AtendimentoKanban },

  setup() {
    return {
      atendimentoStore: useAtendimentoStore(),
      alertStore: useAlertStore()
    }
  },

  data() {
    return {
      visualizacao: 'calendario',
      periodoAtivo: 'mes',
      dialogNovoAtendimento: false,
      dialogEditarAtendimento: false,
      atendimentoSelecionado: null,
      dataSelecionada: null,
      periodos: [
        { key: 'mes',         label: 'Este Mês' },
        { key: 'mes_passado', label: 'Mês Passado' },
        { key: '3meses',      label: '3 Meses' },
        { key: '6meses',      label: '6 Meses' },
        { key: 'ano',         label: 'Este Ano' },
        { key: 'tudo',        label: 'Tudo' }
      ]
    }
  },

  computed: {
    atendimentos() {
      return this.atendimentoStore.atendimentos
    },

    periodoRange() {
      const hoje = new Date()
      const fmtMes = (d) => d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      const fmtShort = (d) => d.toLocaleDateString('pt-BR', { month: 'short' })

      switch (this.periodoAtivo) {
        case 'mes':
          return {
            inicio: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
            fim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0),
            label: fmtMes(hoje)
          }
        case 'mes_passado': {
          const d = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
          return {
            inicio: d,
            fim: new Date(hoje.getFullYear(), hoje.getMonth(), 0),
            label: fmtMes(d)
          }
        }
        case '3meses': {
          const ini = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1)
          return {
            inicio: ini,
            fim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0),
            label: `${fmtShort(ini)} – ${fmtShort(hoje)} ${hoje.getFullYear()}`
          }
        }
        case '6meses': {
          const ini = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1)
          return {
            inicio: ini,
            fim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0),
            label: `${fmtShort(ini)} – ${fmtShort(hoje)} ${hoje.getFullYear()}`
          }
        }
        case 'ano':
          return {
            inicio: new Date(hoje.getFullYear(), 0, 1),
            fim: new Date(hoje.getFullYear(), 11, 31),
            label: `${hoje.getFullYear()}`
          }
        default:
          return { inicio: null, fim: null, label: 'Todo o período' }
      }
    },

    atendimentosFiltrados() {
      const { inicio, fim } = this.periodoRange
      if (!inicio) return this.atendimentos
      return this.atendimentos.filter(a => {
        const [y, m, d] = a.data.split('-').map(Number)
        const data = new Date(y, m - 1, d, 12, 0, 0)
        return data >= inicio && data <= fim
      })
    },

    metricasPeriodo() {
      return MetricasService.getMetricasFiltradas(this.atendimentosFiltrados)
    },

    faturamentoMensal() {
      return MetricasService.getFaturamentoRealizadoPorMes(this.atendimentos)
    },

    melhorMes() {
      if (!this.faturamentoMensal.length) return 0
      return Math.max(...this.faturamentoMensal.map(m => m.total))
    },

    totalQuantidade() {
      return this.faturamentoMensal.reduce((t, m) => t + m.quantidade, 0)
    },

    totalFaturado() {
      return this.faturamentoMensal.reduce((t, m) => t + m.total, 0)
    },

    crescimentoBadge() {
      const c = parseFloat(this.atendimentoStore.metricas.crescimentoMensal)
      if (c > 0) return `+${c}%`
      if (c < 0) return `${c}%`
      return '0%'
    },

    crescimentoBadgeColor() {
      const c = parseFloat(this.atendimentoStore.metricas.crescimentoMensal)
      if (c > 0) return 'success'
      if (c < 0) return 'error'
      return 'grey'
    }
  },

  mounted() {
    this.atendimentoStore.carregarAtendimentos()
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    },

    isCurrentMonth(item) {
      const hoje = new Date()
      return item.mes === hoje.getMonth() + 1 && item.ano === hoje.getFullYear()
    },

    variacaoClass(variacao) {
      return variacao >= 0 ? 'variacao-up' : 'variacao-down'
    },

    async handleSalvarAtendimento(formData) {
      try {
        await this.atendimentoStore.criarAtendimento(formData)
        this.alertStore.showSuccess('Atendimento criado com sucesso!')
        this.dataSelecionada = null
      } catch (error) {
        this.alertStore.showError(error.message)
      }
    },

    async handleUpdateStatus({ atendimento, novoStatus }) {
      try {
        await this.atendimentoStore.atualizarStatus(atendimento.id, novoStatus)
        if (novoStatus === 'cancelado') {
          this.alertStore.showWarning('Atendimento cancelado. Faturamento atualizado.')
        } else {
          this.alertStore.showSuccess('Status atualizado com sucesso!')
        }
      } catch (error) {
        this.alertStore.showError(error.message)
      }
    },

    handleDiaClick(dia) {
      this.dataSelecionada = dia.data
      this.dialogNovoAtendimento = true
    },

    abrirEdicao(atendimento) {
      this.atendimentoSelecionado = { ...atendimento }
      this.dialogEditarAtendimento = true
    },

    handleEventoClick(atendimento) { this.abrirEdicao(atendimento) },
    handleCardClick(atendimento) { this.abrirEdicao(atendimento) },

    async handleEditarAtendimento(formData) {
      try {
        const id = formData.id || this.atendimentoSelecionado?.id
        await this.atendimentoStore.editarAtendimento(id, formData)
        if (formData.status === 'cancelado') {
          this.alertStore.showWarning('Atendimento cancelado. Faturamento atualizado.')
        } else if (formData.sinalPago) {
          this.alertStore.showSuccess('Atendimento atualizado! Sinal pago contabilizado.')
        } else {
          this.alertStore.showSuccess('Atendimento atualizado com sucesso!')
        }
        this.atendimentoSelecionado = null
      } catch (error) {
        this.alertStore.showError(error.message)
      }
    },

    exportarBackup() {
      this.atendimentoStore.exportarBackup()
      this.alertStore.showSuccess('Backup exportado com sucesso!')
    },

    async importarBackup(event) {
      const arquivo = event.target.files[0]
      if (!arquivo) return
      try {
        const resultado = await this.atendimentoStore.importarBackup(arquivo)
        this.alertStore.showSuccess(`Backup importado! ${resultado.importados} atendimento(s) restaurado(s).`)
      } catch (error) {
        this.alertStore.showError(error.message)
      }
      event.target.value = ''
    }
  }
}
</script>

<style scoped>
/* ── Layout geral ──────────────────────────────────────────────── */
.atendimento-view {
  padding: 20px 24px 32px;
  max-width: 1600px;
  margin: 0 auto;
  background: #F8F8F7;
  min-height: 100vh;
}

/* ── Header ───────────────────────────────────────────────────── */
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A1A;
  line-height: 1;
}

.page-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  color: #AAA;
  margin-top: 3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* ── Header native buttons ─────────────────────────────────────── */
.hbtn {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 8px;
  padding: 7px 13px;
  transition: all 0.12s ease;
  letter-spacing: 0.1px;
  white-space: nowrap;
}

.hbtn-outline {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  color: #555;
}

.hbtn-outline:hover:not(:disabled) {
  background: #F7F7F7;
  border-color: #CCC;
  color: #333;
}

.hbtn-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hbtn-primary {
  background: #D68B36;
  border: none;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(214,139,54,0.25);
  font-weight: 700;
}

.hbtn-primary:hover {
  background: #C07A28;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(214,139,54,0.38);
}

/* ── Período ───────────────────────────────────────────────────── */
.period-bar {
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.period-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.period-chip {
  font-family: 'Nunito', sans-serif;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #EBEBEB;
  background: transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.12s ease;
  letter-spacing: 0.1px;
}

.period-chip:hover {
  border-color: #D68B36;
  color: #D68B36;
  background: rgba(214, 139, 54, 0.05);
}

.period-chip.active {
  background: #D68B36;
  border-color: #D68B36;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(214, 139, 54, 0.35);
}

.period-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.period-label-text {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  text-transform: capitalize;
}

.period-count {
  font-family: 'Nunito', sans-serif;
  font-size: 0.75rem;
  color: #999;
  border-left: 1px solid #E0E0E0;
  padding-left: 8px;
  margin-left: 2px;
}

/* ── Section labels ───────────────────────────────────────────── */
.section-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: #AAA;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ── Section header ───────────────────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.section-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1A1A1A;
}

.section-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.74rem;
  color: #BBB;
  margin-top: 1px;
}

.highlight-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #C96B64;
  background: #FFF0EE;
  border: 1px solid #F5C8C4;
  border-radius: 20px;
  padding: 4px 12px;
  letter-spacing: 0.3px;
}

/* ── Monthly breakdown ────────────────────────────────────────── */
.monthly-section {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #EFEFEF;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.empty-monthly {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  gap: 8px;
  color: #AAA;
}

.empty-monthly p {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #BBB;
  margin: 0;
}

.empty-monthly span {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  color: #CCC;
  text-align: center;
}

.monthly-table-wrap {
  overflow-x: auto;
}

.monthly-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Nunito', sans-serif;
}

.monthly-table thead tr {
  border-bottom: 2px solid #F0F0F0;
}

.monthly-table th {
  font-size: 0.68rem;
  font-weight: 700;
  color: #AAA;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 8px 12px;
  text-align: left;
}

.monthly-table td {
  padding: 10px 12px;
  font-size: 0.875rem;
  color: #333;
  border-bottom: 1px solid #F5F5F5;
  vertical-align: middle;
}

.monthly-table tbody tr:last-child td {
  border-bottom: none;
}

.row-stripe td {
  background: #FAFAFA;
}

.row-current td {
  background: #FFF8F7 !important;
}

.row-current .mes-label {
  color: #C96B64;
  font-weight: 700;
}

.col-mes   { width: 110px; }
.col-qtd   { width: 80px; text-align: center; }
.col-valor { width: 180px; }
.col-bar   { min-width: 120px; }
.col-var   { width: 110px; text-align: right; }

.mes-label {
  font-weight: 600;
  color: #333;
}

.current-badge {
  font-size: 0.6rem;
  font-weight: 700;
  background: #FFF0EE;
  color: #C96B64;
  border: 1px solid #F5C8C4;
  border-radius: 8px;
  padding: 1px 6px;
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  vertical-align: middle;
}

.qtd-value {
  font-weight: 700;
  color: #555;
  display: block;
  text-align: center;
}

.valor-realizado {
  font-weight: 700;
  color: #1A1A1A;
  font-size: 0.9rem;
}

.progress-bar-wrap {
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #C96B64, #E8A44D);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.variacao {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.variacao-up {
  color: #1A8C5C;
  background: rgba(26, 140, 92, 0.08);
}

.variacao-down {
  color: #DC2626;
  background: rgba(220, 38, 38, 0.08);
}

.variacao-null {
  color: #CCC;
  font-size: 0.85rem;
}

.total-row td {
  border-top: 2px solid #F0F0F0;
  font-weight: 700;
  color: #1A1A1A;
  font-size: 0.875rem;
  background: #FAFAFA;
}

/* ── View toggle (native) ─────────────────────────────────────── */
.view-toggle {
  display: flex;
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.view-toggle-btn {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 7px;
  padding: 6px 14px;
  color: #999;
  transition: all 0.12s ease;
  letter-spacing: 0.1px;
}

.view-toggle-btn:hover {
  color: #555;
  background: #F5F5F5;
}

.view-toggle-btn.active {
  background: #D68B36;
  color: #FFFFFF;
  box-shadow: 0 1px 4px rgba(214,139,54,0.3);
}

.content-view {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsivo ───────────────────────────────────────────────── */
@media (max-width: 768px) {
  .atendimento-view {
    padding: 16px;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hbtn-primary {
    width: 100%;
    justify-content: center;
  }

  .period-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .monthly-section {
    padding: 14px;
  }
}
</style>
