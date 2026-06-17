<template>
  <div class="kanban-board">
    <div
      v-for="coluna in colunas"
      :key="coluna.status"
      class="kanban-column"
      @drop="handleDrop($event, coluna.status)"
      @dragover.prevent
      @dragenter.prevent
    >
      <div class="column-header">
        <div class="d-flex align-center">
          <v-icon :color="coluna.color" size="20" class="me-2">{{ coluna.icon }}</v-icon>
          <span class="column-title">{{ coluna.titulo }}</span>
        </div>
        <v-chip size="x-small" :color="coluna.color" variant="flat" class="column-count">
          {{ getAtendimentosPorStatus(coluna.status).length }}
        </v-chip>
      </div>

      <div class="column-content">
        <div
          v-for="atendimento in getAtendimentosPorStatus(coluna.status)"
          :key="atendimento.id"
          class="kanban-card"
          draggable="true"
          @dragstart="handleDragStart($event, atendimento)"
          @click="handleCardClick(atendimento)"
        >
          <div class="card-header mb-2">
            <v-icon size="16" :color="coluna.color">mdi-account</v-icon>
            <span class="card-name">{{ atendimento.cliente }}</span>
          </div>

          <div class="card-body mb-2">
            <div class="card-info">
              <v-icon size="14" color="grey">mdi-spa</v-icon>
              <span>{{ atendimento.procedimento }}</span>
            </div>
            <div class="card-info">
              <v-icon size="14" color="grey">mdi-calendar</v-icon>
              <span>{{ formatarData(atendimento.data) }}</span>
            </div>
            <div class="card-info">
              <v-icon size="14" color="grey">mdi-clock-outline</v-icon>
              <span>{{ atendimento.hora }}</span>
            </div>
          </div>

          <div class="card-footer">
            <v-chip
              size="x-small"
              :color="atendimento.sinalPago ? 'success' : 'grey-lighten-1'"
              variant="flat"
              class="sinal-chip"
            >
              <v-icon start size="12">
                {{ atendimento.sinalPago ? 'mdi-check-circle' : 'mdi-alert-circle-outline' }}
              </v-icon>
              {{ atendimento.sinalPago ? 'Sinal Pago' : 'Sinal Não Pago' }}
            </v-chip>
            <div class="card-values">
              <span v-if="atendimento.sinalPago && atendimento.valorSinal" class="card-sinal">
                Sinal: {{ formatarValor(atendimento.valorSinal) }}
              </span>
              <span class="card-value">{{ formatarValor(atendimento.valor) }}</span>
            </div>
          </div>

          <!-- Indicador de clique para editar -->
          <div class="card-edit-hint">
            <v-icon size="12" color="grey-lighten-1">mdi-pencil</v-icon>
            <span>Clique para editar</span>
          </div>
        </div>

        <div v-if="getAtendimentosPorStatus(coluna.status).length === 0" class="empty-column">
          <v-icon size="40" color="grey-lighten-2">{{ coluna.icon }}</v-icon>
          <span class="empty-text">Nenhum atendimento</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AtendimentoKanban',
  props: {
    atendimentos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update-status', 'card-click'],
  data() {
    return {
      colunas: [
        {
          status: 'agendado',
          titulo: 'Agendado',
          color: 'blue',
          icon: 'mdi-clock-outline'
        },
        {
          status: 'confirmado',
          titulo: 'Confirmado',
          color: 'orange',
          icon: 'mdi-check-circle'
        },
        {
          status: 'realizado',
          titulo: 'Realizado',
          color: 'success',
          icon: 'mdi-check-all'
        },
        {
          status: 'cancelado',
          titulo: 'Cancelado',
          color: 'error',
          icon: 'mdi-close-circle'
        }
      ],
      draggedItem: null
    }
  },
  methods: {
    getAtendimentosPorStatus(status) {
      return this.atendimentos.filter(a => a.status === status)
    },
    handleDragStart(event, atendimento) {
      this.draggedItem = atendimento
      event.dataTransfer.effectAllowed = 'move'
    },
    handleDrop(event, novoStatus) {
      if (this.draggedItem && this.draggedItem.status !== novoStatus) {
        this.$emit('update-status', {
          atendimento: this.draggedItem,
          novoStatus: novoStatus
        })
      }
      this.draggedItem = null
    },
    handleCardClick(atendimento) {
      this.$emit('card-click', atendimento)
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
    },
    formatarValor(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor)
    }
  }
}
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 4px;
}

.kanban-column {
  background: rgba(250, 241, 226, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(234, 168, 59, 0.15);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.column-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(234, 168, 59, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px 12px 0 0;
}

.column-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.column-count {
  font-size: 0.688rem;
  font-weight: 700;
  height: 20px;
}

.column-content {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.kanban-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  position: relative;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(234, 168, 59, 0.3);
}

.kanban-card:hover .card-edit-hint {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.75rem;
  color: #666;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.card-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.card-sinal {
  font-family: 'Nunito', sans-serif;
  font-size: 0.688rem;
  font-weight: 600;
  color: #4CAF50;
}

.sinal-chip {
  font-size: 0.625rem;
  font-weight: 600;
  height: 20px;
}

.card-value {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #2E7D32;
}

.card-edit-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.625rem;
  color: #bbb;
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  opacity: 0.5;
}

.empty-text {
  font-family: 'Nunito', sans-serif;
  font-size: 0.813rem;
  color: #999;
}

/* Responsivo */
@media (max-width: 1200px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
