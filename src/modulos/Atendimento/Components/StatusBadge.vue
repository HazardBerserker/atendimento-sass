<template>
  <v-chip
    :color="statusColor"
    :variant="variant"
    size="small"
    class="status-badge"
  >
    <v-icon v-if="showIcon" start size="14">{{ statusIcon }}</v-icon>
    {{ statusText }}
  </v-chip>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['agendado', 'confirmado', 'realizado', 'cancelado'].includes(value)
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String,
      default: 'flat'
    }
  },
  computed: {
    statusConfig() {
      const configs = {
        agendado: {
          color: 'blue-lighten-4',
          icon: 'mdi-clock-outline',
          text: 'Agendado'
        },
        confirmado: {
          color: 'green-lighten-4',
          icon: 'mdi-check-circle',
          text: 'Confirmado'
        },
        realizado: {
          color: 'success',
          icon: 'mdi-check-all',
          text: 'Realizado'
        },
        cancelado: {
          color: 'red-lighten-4',
          icon: 'mdi-close-circle',
          text: 'Cancelado'
        }
      }
      return configs[this.status] || configs.agendado
    },
    statusColor() {
      return this.statusConfig.color
    },
    statusIcon() {
      return this.statusConfig.icon
    },
    statusText() {
      return this.statusConfig.text
    }
  }
}
</script>

<style scoped>
.status-badge {
  font-family: 'Nunito', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}
</style>
