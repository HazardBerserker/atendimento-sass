<template>
  <div class="kanban-board">
    <div
      v-for="coluna in colunas"
      :key="coluna.status"
      class="kanban-column"
      :data-status="coluna.status"
      :class="{ 'drop-target': dragging && hoveredStatus === coluna.status && draggedItem && draggedItem.status !== coluna.status }"
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
          :class="{ 'is-dragging': dragging && draggedItem && draggedItem.id === atendimento.id }"
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
              <v-icon start size="12">{{ atendimento.sinalPago ? 'mdi-check-circle' : 'mdi-alert-circle-outline' }}</v-icon>
              {{ atendimento.sinalPago ? 'Sinal Pago' : 'Sinal Não Pago' }}
            </v-chip>
            <div class="card-values">
              <span v-if="atendimento.sinalPago && atendimento.valorSinal" class="card-sinal">
                Sinal: {{ formatarValor(atendimento.valorSinal) }}
              </span>
              <span class="card-value">{{ formatarValor(atendimento.valor) }}</span>
            </div>
          </div>

          <!-- Alça de arraste (área grande, com texto) -->
          <button
            class="drag-handle"
            aria-label="Segure e arraste para mover de coluna"
            @pointerdown.stop="onHandleDown($event, atendimento)"
            @click.stop
          >
            <v-icon size="17" color="var(--c-primary)">mdi-drag-horizontal-variant</v-icon>
            <span>Segure e arraste para mover</span>
          </button>
        </div>

        <div v-if="getAtendimentosPorStatus(coluna.status).length === 0" class="empty-column">
          <v-icon size="40" color="var(--c-border-strong)">{{ coluna.icon }}</v-icon>
          <span class="empty-text">Nenhum atendimento</span>
        </div>
      </div>
    </div>

    <!-- Card fantasma que segue o ponteiro/dedo durante o arraste -->
    <div
      v-if="dragging && draggedItem"
      class="kanban-ghost"
      :style="{ left: ghost.x + 'px', top: ghost.y + 'px', width: ghost.w + 'px' }"
    >
      <div class="ghost-header">
        <v-icon size="16" color="var(--c-primary)">mdi-account</v-icon>
        <span class="ghost-name">{{ draggedItem.cliente }}</span>
      </div>
      <div class="ghost-proc">{{ draggedItem.procedimento }}</div>
      <div class="ghost-foot">
        <span>{{ formatarData(draggedItem.data) }} · {{ draggedItem.hora }}</span>
        <span class="ghost-value">{{ formatarValor(draggedItem.valor) }}</span>
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
      draggedItem: null,
      dragging: false,
      hoveredStatus: null,
      ghost: { x: 0, y: 0, w: 0 },
    }
  },
  beforeUnmount() {
    if (this._scrollTimer) clearInterval(this._scrollTimer)
    this.removerListeners()
  },
  methods: {
    getAtendimentosPorStatus(status) {
      return this.atendimentos.filter(a => a.status === status)
    },

    handleCardClick(atendimento) {
      // ignora o clique se acabou de arrastar
      if (this._acabouDeArrastar) return
      this.$emit('card-click', atendimento)
    },

    // ── Drag por Pointer Events, iniciado pela alça (mouse + toque) ──
    onHandleDown(e, atendimento) {
      // só botão principal do mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return

      const handle = e.currentTarget
      const card = handle.closest('.kanban-card') || handle
      const rect = card.getBoundingClientRect()
      this._drag = {
        item: atendimento,
        el: card,
        handle,
        type: e.pointerType,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        width: rect.width,
        time: Date.now(),
        started: false,
        timer: null,
      }
      // captura o ponteiro para receber todos os moves (inclusive no toque)
      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(e.pointerId) } catch (_) { /* ignore */ }
      }

      window.addEventListener('pointermove', this.onPointerMove, { passive: false })
      window.addEventListener('pointerup', this.onPointerUp)
      window.addEventListener('pointercancel', this.onPointerCancel)
    },

    onPointerMove(e) {
      const d = this._drag
      if (!d) return
      d.lastX = e.clientX
      d.lastY = e.clientY

      if (!d.started) {
        // qualquer arraste acima do limiar inicia o movimento (mouse e toque)
        const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY)
        if (dist > 6) this.iniciarArraste()
        else return
      }

      e.preventDefault()
      this.atualizarFantasma(e.clientX, e.clientY)
      this.atualizarColunaAlvo(e.clientX, e.clientY)
    },

    iniciarArraste() {
      const d = this._drag
      if (!d || d.started) return
      d.started = true
      this.dragging = true
      this.draggedItem = d.item
      document.body.style.userSelect = 'none'
      if (navigator.vibrate) navigator.vibrate(12)
      this.atualizarFantasma(d.lastX, d.lastY)
      this.atualizarColunaAlvo(d.lastX, d.lastY)
      // auto-scroll quando o dedo/ponteiro chega às bordas da tela
      this._scrollTimer = setInterval(this.edgeScroll, 16)
    },

    edgeScroll() {
      const d = this._drag
      if (!d || !d.started) return
      const margem = 90, passo = 14, h = window.innerHeight
      let dy = 0
      if (d.lastY < margem) dy = -passo
      else if (d.lastY > h - margem) dy = passo
      if (dy !== 0) {
        window.scrollBy(0, dy)
        this.atualizarColunaAlvo(d.lastX, d.lastY)
      }
    },

    atualizarFantasma(x, y) {
      const d = this._drag
      if (!d) return
      this.ghost = { x: x - d.offsetX, y: y - d.offsetY, w: d.width }
    },

    atualizarColunaAlvo(x, y) {
      const el = document.elementFromPoint(x, y)
      const col = el && el.closest('[data-status]')
      this.hoveredStatus = col ? col.getAttribute('data-status') : null
    },

    onPointerUp() {
      const d = this._drag
      if (!d) return

      // arraste pela alça: se soltou sobre outra coluna, muda o status
      if (d.started && this.hoveredStatus && this.hoveredStatus !== d.item.status) {
        this.$emit('update-status', { atendimento: d.item, novoStatus: this.hoveredStatus })
      }
      // evita que o clique residual no card abra a edição logo após arrastar
      if (d.started) {
        this._acabouDeArrastar = true
        setTimeout(() => { this._acabouDeArrastar = false }, 250)
      }
      this.finalizarArraste()
    },

    onPointerCancel() {
      this.finalizarArraste()
    },

    finalizarArraste() {
      if (this._scrollTimer) { clearInterval(this._scrollTimer); this._scrollTimer = null }
      this.removerListeners()
      this.dragging = false
      this.draggedItem = null
      this.hoveredStatus = null
      document.body.style.userSelect = ''
      this._drag = null
    },

    removerListeners() {
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
      window.removeEventListener('pointercancel', this.onPointerCancel)
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
  background: var(--c-surface-2);
  border-radius: 14px;
  border: 1px solid var(--c-border-soft);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

/* Coluna destacada como alvo do arraste */
.kanban-column.drop-target {
  border-color: var(--c-primary);
  background: var(--c-primary-softer);
  box-shadow: 0 0 0 2px var(--c-primary-soft) inset;
}
.kanban-column.drop-target .column-content {
  outline: 2px dashed var(--c-primary);
  outline-offset: -6px;
  border-radius: 12px;
}

.column-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(234, 168, 59, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--c-surface);
  border-radius: 12px 12px 0 0;
}

.column-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text);
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
  background: var(--c-surface);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  position: relative;
  -webkit-user-select: none;
  user-select: none;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-border-strong);
}

/* Entrada suave dos cards */
.kanban-card {
  animation: cardIn 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Card sendo arrastado (original fica esmaecido no lugar) */
.kanban-card.is-dragging {
  opacity: 0.35;
  transform: scale(0.97);
  cursor: grabbing;
  animation: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Alça de arraste — barra larga com texto, alvo de toque grande */
.drag-handle {
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 10px;
  border: 1px dashed var(--c-border-strong);
  background: var(--c-primary-softer);
  border-radius: 9px;
  cursor: grab;
  touch-action: none;            /* arrastar pela alça não rola a tela */
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-primary);
  letter-spacing: 0.2px;
  transition: background 0.15s ease, border-color 0.15s ease;
  -webkit-user-select: none;
  user-select: none;
}
.drag-handle:hover {
  background: var(--c-primary-soft);
  border-color: var(--c-primary);
}
.drag-handle:active { cursor: grabbing; }

.card-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text);
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
  color: var(--c-text-soft);
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
  color: var(--c-text-soft);
}

/* ── Card fantasma (segue o dedo/ponteiro) ──────────────── */
.kanban-ghost {
  position: fixed;
  z-index: 4000;
  pointer-events: none;
  background: var(--c-surface);
  border: 1px solid var(--c-primary);
  border-radius: 10px;
  padding: 12px;
  box-shadow: var(--shadow-lg);
  transform: rotate(-2deg) scale(1.03);
  opacity: 0.97;
  will-change: left, top;
}
.ghost-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.ghost-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--c-text);
}
.ghost-proc {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  color: var(--c-text-soft);
  margin-bottom: 6px;
}
.ghost-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  color: var(--c-text-soft);
}
.ghost-value { font-weight: 800; color: var(--c-primary); }

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
