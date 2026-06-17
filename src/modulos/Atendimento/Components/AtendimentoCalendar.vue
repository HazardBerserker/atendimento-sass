<template>
  <div class="cal-wrap">

    <!-- ── Header ──────────────────────────────────── -->
    <div class="cal-header">
      <div class="cal-nav">
        <button class="cal-nav-btn" @click="mesAnterior">
          <v-icon size="18" color="var(--c-text-soft)">mdi-chevron-left</v-icon>
        </button>
        <span class="cal-month-label">{{ mesAnoAtual }}</span>
        <button class="cal-nav-btn" @click="proximoMes">
          <v-icon size="18" color="var(--c-text-soft)">mdi-chevron-right</v-icon>
        </button>
      </div>
      <button class="cal-hoje-btn" @click="irParaHoje">Hoje</button>
    </div>

    <!-- ── Weekday labels ──────────────────────────── -->
    <div class="cal-grid cal-weekdays">
      <div v-for="dia in diasDaSemana" :key="dia" class="cal-weekday">{{ dia }}</div>
    </div>

    <!-- ── Days grid ───────────────────────────────── -->
    <div class="cal-grid cal-days">
      <div
        v-for="(dia, index) in diasDoMes"
        :key="index"
        class="cal-day"
        :class="{
          'is-other-month': !dia.mesAtual,
          'is-today':       dia.isHoje,
          'is-weekend':     dia.isFimDeSemana && dia.mesAtual,
          'is-holiday':     dia.feriado && dia.mesAtual,
          'has-events':     dia.atendimentos.length > 0
        }"
        @click="dia.mesAtual && handleDiaClick(dia)"
      >
        <!-- Day number -->
        <div class="day-top">
          <span class="day-num">{{ dia.dia }}</span>
          <span v-if="dia.feriado && dia.mesAtual" class="holiday-dot" :title="dia.feriado"></span>
        </div>

        <!-- Holiday name -->
        <div v-if="dia.feriado && dia.mesAtual" class="holiday-name">{{ dia.feriado }}</div>

        <!-- Events -->
        <div v-if="dia.atendimentos.length > 0" class="day-events">
          <div
            v-for="(at, idx) in dia.atendimentos.slice(0, 2)"
            :key="idx"
            class="event-pill"
            :class="at.sinalPago ? 'pill-pago' : 'pill-pendente'"
            @click.stop="handleEventoClick(at)"
          >
            <span class="event-time">{{ at.hora }}</span>
            <span class="event-name">{{ at.cliente.split(' ')[0] }}</span>
          </div>
          <div v-if="dia.atendimentos.length > 2" class="events-more">
            +{{ dia.atendimentos.length - 2 }}
          </div>
        </div>
      </div>
    </div>

    <!-- ── Day detail dialog ───────────────────────── -->
    <v-dialog v-model="dialogDia" max-width="380" transition="dialog-bottom-transition">
      <div class="day-dialog">

        <!-- Header -->
        <div class="day-dialog-header">
          <div>
            <div class="day-dialog-title">{{ diaSelecionadoLabel }}</div>
            <div v-if="diaSelecionado?.feriado" class="day-dialog-holiday">
              <v-icon size="12" color="#C62828">mdi-star-four-points</v-icon>
              {{ diaSelecionado.feriado }}
            </div>
          </div>
          <button class="day-dialog-close" @click="dialogDia = false">
            <v-icon size="16" color="var(--c-text-faint)">mdi-close</v-icon>
          </button>
        </div>

        <!-- Events list -->
        <div class="day-dialog-body">
          <div v-if="diaSelecionado && diaSelecionado.atendimentos.length > 0" class="day-events-list">
            <div
              v-for="(at, idx) in diaSelecionado.atendimentos"
              :key="idx"
              class="day-event-row"
              :class="at.sinalPago ? 'row-pago' : 'row-pendente'"
              @click="handleEventoClick(at); dialogDia = false"
            >
              <div class="event-row-left">
                <span class="event-row-time">{{ at.hora }}</span>
                <span class="event-row-name">{{ at.cliente }}</span>
              </div>
              <span class="event-status-badge" :class="`badge-${at.status}`">{{ at.status }}</span>
            </div>
          </div>
          <div v-else class="day-empty">
            <v-icon size="28" color="var(--c-border-strong)">mdi-calendar-blank</v-icon>
            <p>Nenhum atendimento</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="day-dialog-footer">
          <button class="day-dialog-cancel" @click="dialogDia = false">Fechar</button>
          <button class="day-dialog-add" @click="novoAtendimentoDoDia">
            <v-icon size="14">mdi-plus</v-icon>
            Novo Atendimento
          </button>
        </div>

      </div>
    </v-dialog>

  </div>
</template>

<script>
export default {
  name: 'AtendimentoCalendar',
  props: {
    atendimentos: { type: Array, default: () => [] }
  },
  emits: ['dia-click', 'evento-click'],
  data() {
    return {
      dataAtual: new Date(),
      diasDaSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dialogDia: false,
      diaSelecionado: null
    }
  },
  computed: {
    mesAnoAtual() {
      const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                     'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
      return `${meses[this.dataAtual.getMonth()]} ${this.dataAtual.getFullYear()}`
    },
    feriadosDoAno() {
      return this.calcularFeriados(this.dataAtual.getFullYear())
    },
    diasDoMes() {
      const ano = this.dataAtual.getFullYear()
      const mes = this.dataAtual.getMonth()
      const primeiroDia = new Date(ano, mes, 1)
      const ultimoDia   = new Date(ano, mes + 1, 0)
      const diasAnteriores = primeiroDia.getDay()
      const dias = []

      const mesAnterior = new Date(ano, mes, 0)
      for (let i = diasAnteriores - 1; i >= 0; i--) {
        const data = new Date(ano, mes - 1, mesAnterior.getDate() - i)
        dias.push({ dia: mesAnterior.getDate() - i, data, mesAtual: false,
          isHoje: false, isFimDeSemana: data.getDay() === 0 || data.getDay() === 6,
          feriado: this.getFeriado(data), atendimentos: [] })
      }

      const hoje = new Date()
      for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const data = new Date(ano, mes, i)
        dias.push({ dia: i, data, mesAtual: true,
          isHoje: data.toDateString() === hoje.toDateString(),
          isFimDeSemana: data.getDay() === 0 || data.getDay() === 6,
          feriado: this.getFeriado(data),
          atendimentos: this.getAtendimentosPorDia(data) })
      }

      const restantes = 42 - dias.length
      for (let i = 1; i <= restantes; i++) {
        const data = new Date(ano, mes + 1, i)
        dias.push({ dia: i, data, mesAtual: false,
          isHoje: false, isFimDeSemana: data.getDay() === 0 || data.getDay() === 6,
          feriado: this.getFeriado(data), atendimentos: [] })
      }
      return dias
    },
    diaSelecionadoLabel() {
      if (!this.diaSelecionado) return ''
      const data = this.diaSelecionado.data
      const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                     'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
      return `${data.getDate()} de ${meses[data.getMonth()]}`
    }
  },
  methods: {
    calcularPascoa(ano) {
      const a=ano%19,b=Math.floor(ano/100),c=ano%100,d=Math.floor(b/4),e=b%4
      const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3)
      const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4
      const l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451)
      return new Date(ano,Math.floor((h+l-7*m+114)/31)-1,((h+l-7*m+114)%31)+1)
    },
    calcularFeriados(ano) {
      const p = this.calcularPascoa(ano)
      const add = (d, n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r }
      const key = d => d.toDateString()
      const f = {}
      ;[{mes:0,dia:1,nome:'Ano Novo'},{mes:3,dia:21,nome:'Tiradentes'},
        {mes:4,dia:1,nome:'Dia do Trabalho'},{mes:8,dia:7,nome:'Independência'},
        {mes:9,dia:12,nome:'N. Sra. Aparecida'},{mes:10,dia:2,nome:'Finados'},
        {mes:10,dia:15,nome:'Proclamação da República'},{mes:10,dia:20,nome:'Consciência Negra'},
        {mes:11,dia:25,nome:'Natal'}
      ].forEach(x => { f[key(new Date(ano,x.mes,x.dia))] = x.nome })
      f[key(add(p,-47))]='Carnaval'; f[key(add(p,-46))]='Carnaval'
      f[key(add(p,-2))]='Sexta-feira Santa'; f[key(p)]='Páscoa'
      f[key(add(p,60))]='Corpus Christi'
      return f
    },
    getFeriado(data) {
      const chave = data.toDateString()
      if (this.feriadosDoAno[chave]) return this.feriadosDoAno[chave]
      const anoData = data.getFullYear()
      if (anoData !== this.dataAtual.getFullYear()) {
        const f2 = this.calcularFeriados(anoData)
        if (f2[chave]) return f2[chave]
      }
      return null
    },
    getAtendimentosPorDia(data) {
      const ano = data.getFullYear()
      const mes = String(data.getMonth()+1).padStart(2,'0')
      const dia = String(data.getDate()).padStart(2,'0')
      const str = `${ano}-${mes}-${dia}`
      return this.atendimentos.filter(a => a.data === str)
    },
    mesAnterior()  { this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth()-1, 1) },
    proximoMes()   { this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth()+1, 1) },
    irParaHoje()   { this.dataAtual = new Date() },
    handleDiaClick(dia) { this.diaSelecionado = dia; this.dialogDia = true },
    handleEventoClick(at) { this.$emit('evento-click', at) },
    novoAtendimentoDoDia() { this.dialogDia = false; this.$emit('dia-click', this.diaSelecionado) }
  }
}
</script>

<style scoped>
/* ── Wrapper ───────────────────────────────────────────── */
.cal-wrap {
  background: var(--c-surface);
  border-radius: 14px;
  border: 1px solid var(--c-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  font-family: 'Nunito', sans-serif;
}

/* ── Header ────────────────────────────────────────────── */
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--c-surface-hover);
  background: var(--c-surface);
}

.cal-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cal-nav-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s ease;
}

.cal-nav-btn:hover {
  background: var(--c-surface-hover);
}

.cal-month-label {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  padding: 0 10px;
  min-width: 160px;
  text-align: center;
}

.cal-hoje-btn {
  font-family: 'Nunito', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-primary);
  background: transparent;
  border: 1px solid #E8C07A;
  border-radius: 7px;
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.1s ease;
  letter-spacing: 0.2px;
}

.cal-hoje-btn:hover {
  background: rgba(214,139,54,0.07);
  border-color: var(--c-primary);
}

/* ── Grid ──────────────────────────────────────────────── */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

/* Weekday row */
.cal-weekdays {
  padding: 0 6px;
  background: var(--c-surface-2);
  border-bottom: 1px solid var(--c-border);
}

.cal-weekday {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--c-text-faint);
  text-align: center;
  padding: 7px 4px;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

/* Days grid */
.cal-days {
  padding: 6px;
  gap: 4px;
  background: var(--c-surface);
}

/* ── Individual day cell ───────────────────────────────── */
.cal-day {
  min-height: 82px;
  padding: 5px 6px;
  border-radius: 8px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: border-color 0.1s ease, box-shadow 0.1s ease;
  overflow: hidden;
}

.cal-day:hover {
  border-color: var(--c-border-strong);
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
}

/* Other month */
.cal-day.is-other-month {
  background: transparent;
  border-color: transparent;
  pointer-events: none;
  opacity: 0.3;
}

/* Weekend */
.cal-day.is-weekend {
  background: var(--c-surface-2);
}

/* Holiday */
.cal-day.is-holiday {
  border-color: rgba(198,40,40,0.12);
}

/* Today */
.cal-day.is-today {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 1px rgba(214,139,54,0.15);
}

/* ── Day number ────────────────────────────────────────── */
.day-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.day-num {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.is-today .day-num {
  background: var(--c-primary);
  color: #FFFFFF;
  font-weight: 700;
}

.is-other-month .day-num {
  color: var(--c-text-faint);
}

.holiday-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C62828;
  opacity: 0.6;
  flex-shrink: 0;
}

/* Holiday name */
.holiday-name {
  font-size: 0.52rem;
  font-weight: 700;
  color: #C62828;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

/* ── Events ────────────────────────────────────────────── */
.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.1s ease;
  border-left: 2px solid;
  overflow: hidden;
}

.event-pill:hover {
  opacity: 0.8;
}

.pill-pago {
  border-left-color: #1A8C5C;
  background: rgba(26,140,92,0.07);
}

.pill-pendente {
  border-left-color: #D97706;
  background: rgba(217,119,6,0.07);
}

.event-time {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--c-text-soft);
  flex-shrink: 0;
}

.event-name {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.events-more {
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--c-text-faint);
  text-align: center;
  padding: 1px 0;
}

/* ── Day detail dialog (native card) ──────────────────── */
.day-dialog {
  background: var(--c-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  font-family: 'Nunito', sans-serif;
}

.day-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--c-surface-hover);
}

.day-dialog-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
}

.day-dialog-holiday {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #C62828;
  margin-top: 3px;
}

.day-dialog-close {
  width: 26px;
  height: 26px;
  border: 1px solid var(--c-border);
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.1s ease;
}

.day-dialog-close:hover {
  background: var(--c-surface-hover);
}

.day-dialog-body {
  padding: 12px 18px;
  max-height: 260px;
  overflow-y: auto;
}

.day-events-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.day-event-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  border-left: 3px solid;
  transition: background 0.1s ease;
}

.day-event-row:hover {
  filter: brightness(0.97);
}

.row-pago    { border-left-color: #1A8C5C; background: rgba(26,140,92,0.05); }
.row-pendente{ border-left-color: #D97706; background: rgba(217,119,6,0.05); }

.event-row-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-row-time {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--c-text);
  flex-shrink: 0;
}

.event-row-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c-text-soft);
}

.event-status-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: capitalize;
}

.badge-agendado  { background: rgba(37,99,235,0.1);  color: #1D4ED8; }
.badge-confirmado{ background: rgba(217,119,6,0.1);  color: #B45309; }
.badge-realizado { background: rgba(26,140,92,0.1);  color: #1A8C5C; }
.badge-cancelado { background: rgba(220,38,38,0.1);  color: #DC2626; }

.day-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 0;
}

.day-empty p {
  font-size: 0.82rem;
  color: var(--c-text-faint);
  margin: 0;
}

.day-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 18px;
  border-top: 1px solid var(--c-surface-hover);
  background: var(--c-surface-2);
}

.day-dialog-cancel {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-text-soft);
  background: transparent;
  border: 1px solid var(--c-border-strong);
  border-radius: 7px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.day-dialog-cancel:hover {
  background: var(--c-surface-hover);
  color: var(--c-text-soft);
}

.day-dialog-add {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: #FFFFFF;
  background: var(--c-primary);
  border: none;
  border-radius: 7px;
  padding: 6px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.1s ease;
  box-shadow: 0 1px 4px rgba(214,139,54,0.25);
}

.day-dialog-add:hover {
  background: var(--c-primary-dark);
}
</style>
