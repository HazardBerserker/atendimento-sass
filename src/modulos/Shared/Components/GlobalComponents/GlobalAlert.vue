<template>
  <teleport to="body">
    <div class="alerts-container">
      <transition-group name="custom-alert" tag="div">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="['custom-alert-item', `alert-${alert.type}`]"
          @click="removeAlert(alert.id)"
        >
          <div class="alert-content">
            <div class="alert-icon">
              <v-icon :color="getIconColor(alert.type)" size="20">
                {{ getIcon(alert.type) }}
              </v-icon>
            </div>
            <div class="alert-message" v-html="alert.message"></div>
            <div class="alert-close">
              <v-icon size="18" color="#666">mdi-close</v-icon>
            </div>
          </div>
          <v-progress-linear
            v-show="alert.duration > 0"
            :model-value="alert.progress"
            height="3"
            :color="getProgressColor(alert.type)"
            bg-opacity="0"
            class="alert-progress"
          />
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>

import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore'

export default {
  computed: {
    alerts() {
      const alertStore = useAlertStore()
      const { alerts } = alertStore
      return alerts
    },
    removeAlert() {
      const alertStore = useAlertStore()
      const { removeAlert } = alertStore
      return removeAlert
    },
  },
  methods: {
    getIcon(type) {
      const icons = {
        success: 'mdi-check-circle',
        error: 'mdi-alert-circle',
        warning: 'mdi-alert',
        info: 'mdi-information'
      }
      return icons[type] || icons.info
    },
    getIconColor(type) {
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      }
      return colors[type] || colors.info
    },
    getProgressColor(type) {
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      }
      return colors[type] || colors.info
    }
  }
}
</script>

<style scoped>
.alerts-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.custom-alert-item {
  min-width: 320px;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-alert-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
}

.alert-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-message {
  flex: 1;
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  color: rgba(30, 30, 30, 0.9);
  line-height: 1.4;
}

.alert-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.alert-progress {
  border-radius: 0 0 16px 16px;
}

/* Variações de tipo */
.alert-success {
  background: rgba(236, 253, 245, 0.98);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.alert-error {
  background: rgba(254, 242, 242, 0.98);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.alert-warning {
  background: rgba(255, 251, 235, 0.98);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.alert-info {
  background: rgba(239, 246, 255, 0.98);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Animações */
.custom-alert-enter-active,
.custom-alert-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-alert-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.custom-alert-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.custom-alert-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.custom-alert-leave-to {
  transform: translateX(100px) scale(0.95);
  opacity: 0;
}

/* Responsivo */
@media (max-width: 640px) {
  .alerts-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .custom-alert-item {
    min-width: auto;
    width: 100%;
  }
}
</style>
