<template>
  <v-dialog
    v-model="internalDialog"
    max-width="600"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="atendimento-dialog" rounded="xl" elevation="12">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-header-left">
          <div class="dialog-icon">
            <v-icon :color="isEditMode ? 'laranjaDarken2' : 'laranja'" size="18">{{ isEditMode ? 'mdi-pencil-outline' : 'mdi-plus' }}</v-icon>
          </div>
          <div>
            <h2 class="dialog-title">{{ isEditMode ? 'Editar Atendimento' : 'Novo Atendimento' }}</h2>
            <p class="dialog-subtitle">{{ isEditMode ? 'Atualize os dados do atendimento' : 'Preencha os dados para agendar' }}</p>
          </div>
        </div>
        <button class="close-btn" @click="fechar">
          <v-icon size="18" color="var(--c-text-soft)">mdi-close</v-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <AtendimentoForm
          ref="atendimentoForm"
          :initial-data="atendimento"
          :edit-mode="isEditMode"
          :data-selecionada="dataSelecionada"
          @submit="handleSubmit"
        />
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button class="btn-cancel" @click="fechar">Cancelar</button>
        <button class="btn-save" @click="salvar" :disabled="loading">
          <v-icon v-if="loading" size="16" class="spin">mdi-loading</v-icon>
          <v-icon v-else size="16">mdi-check</v-icon>
          {{ isEditMode ? 'Salvar Alterações' : 'Criar Atendimento' }}
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import AtendimentoForm from './AtendimentoForm.vue'

export default {
  name: 'AtendimentoDialog',
  components: { AtendimentoForm },
  props: {
    modelValue: { type: Boolean, required: true },
    atendimento: { type: Object, default: null },
    dataSelecionada: { type: Date, default: null }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return { loading: false }
  },
  computed: {
    internalDialog: {
      get() { return this.modelValue },
      set(value) { this.$emit('update:modelValue', value) }
    },
    isEditMode() { return !!this.atendimento }
  },
  methods: {
    fechar() {
      this.internalDialog = false
    },
    async salvar() {
      const isValid = await this.$refs.atendimentoForm.validate()
      if (isValid) {
        this.$refs.atendimentoForm.submit()
      }
    },
    handleSubmit(formData) {
      this.loading = true
      this.$emit('save', formData)
      setTimeout(() => {
        this.loading = false
        this.fechar()
      }, 500)
    }
  }
}
</script>

<style scoped>
.atendimento-dialog {
  background: var(--c-surface) !important;
  overflow: hidden;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--c-border);
}

.dialog-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(234, 168, 59, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-title {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text);
  margin: 0;
  line-height: 1;
}

.dialog-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.75rem;
  color: var(--c-text-faint);
  margin: 3px 0 0;
}

.close-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--c-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: var(--c-surface-hover);
  border-color: var(--c-border-strong);
}

/* Body */
.dialog-body {
  padding: 20px 24px;
  max-height: 65vh;
  overflow-y: auto;
}

/* Footer */
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface-2);
}

.btn-cancel {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text-soft);
  background: transparent;
  border: 1px solid var(--c-border-strong);
  border-radius: 8px;
  padding: 7px 16px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-cancel:hover {
  background: var(--c-surface-hover);
  color: var(--c-text-soft);
}

.btn-save {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: white;
  background: var(--c-primary);
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.12s ease;
  box-shadow: 0 2px 6px rgba(214, 139, 54, 0.3);
}

.btn-save:hover:not(:disabled) {
  background: var(--c-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(214, 139, 54, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}
</style>
