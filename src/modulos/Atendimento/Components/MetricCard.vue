<template>
  <div class="metric-card" :class="`variant-${variant}`">
    <div class="card-top">
      <div class="icon-wrap">
        <v-icon :color="resolvedIconColor" size="16">{{ icon }}</v-icon>
      </div>
      <span v-if="badge" class="badge" :class="`badge-${badgeColor}`">{{ badge }}</span>
    </div>

    <div class="card-value">{{ formattedDisplay }}</div>
    <div class="card-title">{{ title }}</div>
    <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title:      { type: String, required: true },
    value:      { type: [Number, String], required: true },
    icon:       { type: String, default: 'mdi-chart-line' },
    iconColor:  { type: String, default: '' },
    subtitle:   { type: String, default: '' },
    badge:      { type: String, default: '' },
    badgeColor: { type: String, default: 'success' },
    isCurrency: { type: Boolean, default: false },
    variant:    { type: String, default: 'default' }
  },
  data() {
    return { display: 0 }
  },
  computed: {
    resolvedIconColor() {
      if (this.iconColor) return this.iconColor
      return { highlight: '#C16C61', success: '#4F9D72', warning: '#C68A3E',
               danger: '#C9594F', info: '#5B7FB5', default: '#C57F4B' }[this.variant] || '#C57F4B'
    },
    numericValue() {
      const n = Number(this.value)
      return Number.isFinite(n) ? n : null
    },
    formattedDisplay() {
      // Valores não numéricos (ex: percentuais formatados) passam direto
      if (this.numericValue === null) return this.value
      const v = this.display
      if (this.isCurrency) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
      }
      return Number.isInteger(this.numericValue) ? Math.round(v) : v.toFixed(1)
    }
  },
  watch: {
    numericValue: {
      immediate: true,
      handler(novo, antigo) { this.animarValor(antigo || 0, novo) }
    }
  },
  methods: {
    animarValor(de, ate) {
      if (ate === null) return
      if (typeof window === 'undefined' || !window.requestAnimationFrame) {
        this.display = ate
        return
      }
      const inicio = performance.now()
      const dur = 600
      const passo = (agora) => {
        const t = Math.min((agora - inicio) / dur, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        this.display = de + (ate - de) * eased
        if (t < 1) requestAnimationFrame(passo)
        else this.display = ate
      }
      requestAnimationFrame(passo)
    }
  }
}
</script>

<style scoped>
.metric-card {
  background: var(--c-surface);
  border-radius: var(--r-md);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-primary);
  padding: 13px 15px 11px;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.18s ease, transform 0.18s ease;
  height: 100%;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Variant colors */
.variant-highlight { border-left-color: var(--c-rose);    background: var(--c-rose-soft); }
.variant-success   { border-left-color: var(--c-success); background: var(--c-success-soft); }
.variant-warning   { border-left-color: var(--c-warning); background: var(--c-warning-soft); }
.variant-danger    { border-left-color: var(--c-danger);  background: var(--c-danger-soft); }
.variant-info      { border-left-color: var(--c-info);    background: var(--c-info-soft); }

/* Top row: icon + badge */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary-soft);
}

.variant-highlight .icon-wrap { background: var(--c-rose-soft); }
.variant-success   .icon-wrap { background: var(--c-success-soft); }
.variant-warning   .icon-wrap { background: var(--c-warning-soft); }
.variant-danger    .icon-wrap { background: var(--c-danger-soft); }
.variant-info      .icon-wrap { background: var(--c-info-soft); }

/* Badge */
.badge {
  font-family: 'Nunito', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.2px;
}
.badge-success { background: var(--c-success-soft); color: var(--c-success); }
.badge-error   { background: var(--c-danger-soft);  color: var(--c-danger); }
.badge-grey    { background: var(--c-surface-hover); color: var(--c-text-soft); }

/* Value */
.card-value {
  font-family: 'Nunito', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1;
  margin-bottom: 3px;
  letter-spacing: -0.3px;
}

/* Title */
.card-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--c-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Subtitle */
.card-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.65rem;
  color: var(--c-text-faint);
  margin-top: 3px;
  line-height: 1.2;
}
</style>
