<template>
  <div class="metric-card" :class="`variant-${variant}`">
    <div class="card-top">
      <div class="icon-wrap">
        <v-icon :color="resolvedIconColor" size="16">{{ icon }}</v-icon>
      </div>
      <span v-if="badge" class="badge" :class="`badge-${badgeColor}`">{{ badge }}</span>
    </div>

    <div class="card-value">{{ formattedValue }}</div>
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
  computed: {
    resolvedIconColor() {
      if (this.iconColor) return this.iconColor
      return { highlight: '#C96B64', success: '#1A8C5C', warning: '#D97706',
               danger: '#DC2626', info: '#2563EB', default: '#D68B36' }[this.variant] || '#D68B36'
    },
    formattedValue() {
      if (this.isCurrency) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.value)
      }
      return this.value
    }
  }
}
</script>

<style scoped>
.metric-card {
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #EFEFEF;
  border-left: 3px solid #D68B36;
  padding: 12px 14px 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  height: 100%;
}

.metric-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Variant colors */
.variant-highlight { border-left-color: #C96B64; background: #FFF9F8; }
.variant-success   { border-left-color: #1A8C5C; background: #F6FCF9; }
.variant-warning   { border-left-color: #D97706; background: #FFFEF5; }
.variant-danger    { border-left-color: #DC2626; background: #FFF7F7; }
.variant-info      { border-left-color: #2563EB; background: #F6F9FF; }

/* Top row: icon + badge */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(214, 139, 54, 0.09);
}

.variant-highlight .icon-wrap { background: rgba(201,107,100,0.09); }
.variant-success   .icon-wrap { background: rgba(26,140,92,0.09); }
.variant-warning   .icon-wrap { background: rgba(217,119,6,0.09); }
.variant-danger    .icon-wrap { background: rgba(220,38,38,0.09); }
.variant-info      .icon-wrap { background: rgba(37,99,235,0.09); }

/* Badge */
.badge {
  font-family: 'Nunito', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.2px;
}
.badge-success { background: rgba(26,140,92,0.1);  color: #1A8C5C; }
.badge-error   { background: rgba(220,38,38,0.1);  color: #DC2626; }
.badge-grey    { background: rgba(0,0,0,0.07);     color: #777; }

/* Value */
.card-value {
  font-family: 'Nunito', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1;
  margin-bottom: 3px;
  letter-spacing: -0.3px;
}

/* Title */
.card-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Subtitle */
.card-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.65rem;
  color: #BBB;
  margin-top: 3px;
  line-height: 1.2;
}
</style>
