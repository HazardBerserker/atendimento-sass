<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit">

    <!-- Status (edit mode only) -->
    <div v-if="editMode" class="form-group">
      <p class="group-label">Status</p>
      <v-select
        v-model="formData.status"
        :items="statusOptions"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        :rules="[rules.required]"
        hide-details="auto"
        class="field"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon :color="item.raw.color" size="16">{{ item.raw.icon }}</v-icon>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div v-if="editMode" class="sep"></div>

    <!-- Cliente -->
    <div class="form-group">
      <p class="group-label">Cliente</p>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.nomeCompleto"
            placeholder="Nome completo"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            hide-details="auto"
            class="field"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.telefone"
            placeholder="(00) 00000-0000"
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.phone]"
            v-mask="'(##) #####-####'"
            hide-details="auto"
            class="field"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.email"
            placeholder="Email (opcional)"
            variant="outlined"
            density="compact"
            :rules="[rules.email]"
            type="email"
            hide-details="auto"
            class="field"
          />
        </v-col>
      </v-row>
    </div>

    <div class="sep"></div>

    <!-- Procedimento -->
    <div class="form-group">
      <p class="group-label">Procedimento</p>
      <v-select
        v-model="formData.procedimento"
        :items="procedimentos"
        item-title="nome"
        item-value="nome"
        placeholder="Selecione o procedimento"
        variant="outlined"
        density="compact"
        :rules="[rules.required]"
        hide-details="auto"
        class="field"
        @update:model-value="preencherValorProcedimento"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:append>
              <span class="proc-price">R$ {{ item.raw.valor.toFixed(2) }}</span>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div class="sep"></div>

    <!-- Financeiro -->
    <div class="form-group">
      <p class="group-label">Financeiro</p>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.valor"
            placeholder="Valor"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            prefix="R$"
            type="number"
            step="0.01"
            hide-details="auto"
            class="field"
          />
        </v-col>

        <v-col cols="12" md="6">
          <div class="sinal-row">
            <BaseSwitch v-model="formData.sinalPago" label="Sinal recebido" />
          </div>
        </v-col>

        <v-col v-if="formData.sinalPago" cols="12" md="6">
          <v-text-field
            v-model="formData.valorSinal"
            placeholder="Valor do sinal"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            prefix="R$"
            type="number"
            step="0.01"
            hide-details="auto"
            class="field"
          />
        </v-col>

        <v-col v-if="formData.sinalPago" cols="12">
          <div class="sinal-tip">
            <v-icon size="13" color="#1A8C5C">mdi-check-circle</v-icon>
            Sinal contabilizado como faturamento realizado automaticamente
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="sep"></div>

    <!-- Data e Horário -->
    <div class="form-group">
      <p class="group-label">Data e Horário</p>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-date-input
            v-model="formData.dataObj"
            placeholder="Selecione a data"
            variant="outlined"
            density="compact"
            :rules="[rules.requiredDate]"
            hide-details="auto"
            class="field"
            color="laranja"
            prepend-icon=""
            prepend-inner-icon="mdi-calendar-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.hora"
            placeholder="14:00"
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.time]"
            v-mask="'##:##'"
            hide-details="auto"
            class="field"
          >
            <template v-slot:prepend-inner>
              <v-icon size="16" color="var(--c-text-faint)">mdi-clock-outline</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>

  </v-form>
</template>

<script>
import { useProcedimentoStore } from '@/modulos/Configuracoes/Domain/Stores/procedimentoStore'

export default {
  name: 'AtendimentoForm',
  props: {
    initialData:    { type: Object, default: null },
    editMode:       { type: Boolean, default: false },
    dataSelecionada:{ type: Date, default: null }
  },
  emits: ['submit'],
  setup() {
    return { procedimentoStore: useProcedimentoStore() }
  },
  data() {
    return {
      valid: false,
      formData: {
        nomeCompleto: '', telefone: '', email: '', procedimento: '',
        valor: '', sinalPago: false, valorSinal: '', dataObj: null, hora: '', status: 'agendado'
      },
      statusOptions: [
        { value: 'agendado',   label: 'Agendado',   color: '#2563EB', icon: 'mdi-clock-outline' },
        { value: 'confirmado', label: 'Confirmado', color: '#D97706', icon: 'mdi-check-circle' },
        { value: 'realizado',  label: 'Realizado',  color: '#1A8C5C', icon: 'mdi-check-all' },
        { value: 'cancelado',  label: 'Cancelado',  color: '#DC2626', icon: 'mdi-close-circle' }
      ],
      rules: {
        required:     v => !!v || 'Obrigatório',
        requiredDate: v => !!v || 'Selecione uma data',
        email:        v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido',
        phone:        v => !v || /^\(\d{2}\) \d{5}-\d{4}$/.test(v) || 'Telefone inválido',
        time:         v => !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) || 'Use 24h: 14:00'
      }
    }
  },
  computed: {
    procedimentos() {
      return this.procedimentoStore.procedimentosAtivos.map(p => ({ nome: p.nome, valor: p.valor }))
    }
  },
  watch: {
    initialData: {
      immediate: true,
      handler(v) { if (v) this.populateForm(v) }
    },
    dataSelecionada: {
      immediate: true,
      handler(v) {
        if (v && !this.editMode) {
          this.formData.dataObj = new Date(v.getFullYear(), v.getMonth(), v.getDate(), 12, 0, 0)
        }
      }
    }
  },
  methods: {
    preencherValorProcedimento(nome) {
      const p = this.procedimentos.find(x => x.nome === nome)
      if (p && !this.editMode) this.formData.valor = p.valor
    },
    populateForm(a) {
      this.formData = {
        id: a.id || null,
        nomeCompleto: a.cliente || '', telefone: a.telefone || '', email: a.email || '',
        procedimento: a.procedimento || '', valor: a.valor || '',
        sinalPago: a.sinalPago || false, valorSinal: a.valorSinal || '',
        dataObj: a.data ? this.parseData(a.data) : null,
        hora: a.hora || '', status: a.status || 'agendado'
      }
    },
    dateToString(date) {
      if (!date || !(date instanceof Date) || isNaN(date)) return ''
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`
    },
    parseData(s) {
      if (!s) return null
      const [y, m, d] = s.split('-').map(Number)
      return new Date(y, m-1, d, 12, 0, 0)
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()
      return valid
    },
    submit() {
      const d = { ...this.formData }
      d.data = this.dateToString(d.dataObj)
      delete d.dataObj
      this.$emit('submit', d)
      if (!this.editMode) this.reset()
    },
    reset() {
      this.$refs.form.reset()
      this.formData = {
        nomeCompleto:'', telefone:'', email:'', procedimento:'',
        valor:'', sinalPago:false, valorSinal:'', dataObj:null, hora:'', status:'agendado'
      }
    }
  }
}
</script>

<style scoped>
/* ── Groups ──────────────────────────────────────────── */
.form-group {
  padding: 2px 0;
}

.group-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--c-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin: 0 0 8px;
}

.sep {
  height: 1px;
  background: var(--c-surface-hover);
  margin: 12px 0;
}

/* ── Fields ──────────────────────────────────────────── */
.field :deep(.v-field) {
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  background-color: var(--c-surface) !important;
}

.field :deep(.v-field__overlay) {
  background: transparent !important;
  opacity: 0 !important;
}

.field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(214,139,54,0.15);
}

.field :deep(.v-field input),
.field :deep(.v-field textarea) {
  color: var(--c-text) !important;
  caret-color: var(--c-primary) !important;
}

.field :deep(.v-label) {
  color: var(--c-text-faint) !important;
  font-family: 'Nunito', sans-serif;
}

.field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.2;
}

.field :deep(.v-text-field__prefix),
.field :deep(.v-field__prepend-inner .v-icon) {
  color: var(--c-text-faint) !important;
}

.field :deep(.v-select__selection-text) {
  color: var(--c-text) !important;
}

/* ── Procedimento price ──────────────────────────────── */
.proc-price {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--c-primary);
}

/* ── Sinal switch row ────────────────────────────────── */
.sinal-row {
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.sinal-switch :deep(.v-label) {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text) !important;
}

/* ── Sinal tip ───────────────────────────────────────── */
.sinal-tip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  color: #1A8C5C;
  background: rgba(26,140,92,0.07);
  border-radius: 7px;
  padding: 6px 10px;
}

/* ── Date picker ─────────────────────────────────────── */
.field :deep(.v-picker) {
  background: var(--c-surface) !important;
}

.field :deep(.v-date-picker-month__day--selected .v-btn) {
  background-color: var(--c-primary) !important;
  color: white !important;
}
</style>
