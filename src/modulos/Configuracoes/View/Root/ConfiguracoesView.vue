<template>
  <div class="config-view">

    <div class="view-header anim-in" style="--i:0">
      <div>
        <h1 class="page-title">Configurações</h1>
        <p class="page-subtitle">Personalize seu estúdio, serviços e aparência</p>
      </div>
    </div>

    <!-- Abas -->
    <div class="tabs anim-in" style="--i:1">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: aba === t.key }"
        @click="aba = t.key"
      >
        <v-icon size="15">{{ t.icon }}</v-icon>
        {{ t.label }}
      </button>
    </div>

    <!-- ── Serviços ─────────────────────────────────────────── -->
    <div v-if="aba === 'servicos'" class="panel anim-in" style="--i:2">
      <div class="panel-head">
        <div>
          <div class="panel-title">Catálogo de serviços</div>
          <div class="panel-sub">Defina os procedimentos, valores e duração</div>
        </div>
        <button class="btn-primary" @click="abrirNovoProc">
          <v-icon size="15">mdi-plus</v-icon> Novo serviço
        </button>
      </div>

      <div class="proc-list">
        <div
          v-for="p in procedimentoStore.procedimentos"
          :key="p.id"
          class="proc-row"
          :class="{ inativo: !p.ativo }"
        >
          <div class="proc-icon"><v-icon size="17" color="var(--c-primary)">mdi-spa-outline</v-icon></div>
          <div class="proc-info">
            <span class="proc-nome">{{ p.nome }}</span>
            <span class="proc-meta">{{ p.duracao }} min</span>
          </div>
          <span class="proc-valor">{{ formatCurrency(p.valor) }}</span>
          <div class="proc-actions">
            <button class="ic-btn" :title="p.ativo ? 'Desativar' : 'Ativar'" @click="procedimentoStore.alternarAtivo(p.id)">
              <v-icon size="16" :color="p.ativo ? 'var(--c-success)' : 'var(--c-text-faint)'">{{ p.ativo ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
            </button>
            <button class="ic-btn" title="Editar" @click="abrirEditarProc(p)">
              <v-icon size="16" color="var(--c-text-soft)">mdi-pencil-outline</v-icon>
            </button>
            <button class="ic-btn danger" title="Remover" @click="removerProc(p)">
              <v-icon size="16" color="var(--c-danger)">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </div>
      </div>

      <button class="btn-ghost" @click="restaurar">
        <v-icon size="14">mdi-restore</v-icon> Restaurar serviços padrão
      </button>
    </div>

    <!-- ── Estúdio ──────────────────────────────────────────── -->
    <div v-if="aba === 'estudio'" class="panel anim-in" style="--i:2">
      <div class="panel-head">
        <div>
          <div class="panel-title">Dados do estúdio</div>
          <div class="panel-sub">Aparecem no cabeçalho e nos relatórios</div>
        </div>
      </div>

      <div class="form-grid">
        <div class="fld">
          <label>Nome do estúdio</label>
          <input v-model="perfil.nomeEstudio" type="text" placeholder="Ex: Estética Pro" />
        </div>
        <div class="fld">
          <label>Profissional</label>
          <input v-model="perfil.profissional" type="text" placeholder="Seu nome" />
        </div>
        <div class="fld">
          <label>Telefone / WhatsApp</label>
          <input v-model="perfil.telefone" type="text" placeholder="(00) 00000-0000" />
        </div>
        <div class="fld">
          <label>Instagram</label>
          <input v-model="perfil.instagram" type="text" placeholder="@seuestudio" />
        </div>
        <div class="fld full">
          <label>Endereço</label>
          <input v-model="perfil.endereco" type="text" placeholder="Rua, número, bairro" />
        </div>
      </div>

      <div class="save-row">
        <transition name="fade">
          <span v-if="salvo" class="saved-msg"><v-icon size="14" color="var(--c-success)">mdi-check-circle</v-icon> Salvo</span>
        </transition>
        <button class="btn-primary" @click="salvarPerfil">
          <v-icon size="15">mdi-content-save-outline</v-icon> Salvar alterações
        </button>
      </div>
    </div>

    <!-- ── Aparência ────────────────────────────────────────── -->
    <div v-if="aba === 'aparencia'" class="panel anim-in" style="--i:2">
      <div class="panel-head">
        <div>
          <div class="panel-title">Aparência</div>
          <div class="panel-sub">Escolha o tema que combina com seu ambiente</div>
        </div>
      </div>

      <div class="theme-grid">
        <button
          class="theme-card"
          :class="{ active: temaAtual === 'light' }"
          @click="setTema('light')"
        >
          <div class="theme-preview light">
            <span class="tp-bar"></span><span class="tp-block"></span><span class="tp-block sm"></span>
          </div>
          <span class="theme-name"><v-icon size="15">mdi-white-balance-sunny</v-icon> Claro (Areia)</span>
        </button>
        <button
          class="theme-card"
          :class="{ active: temaAtual === 'dark' }"
          @click="setTema('dark')"
        >
          <div class="theme-preview dark">
            <span class="tp-bar"></span><span class="tp-block"></span><span class="tp-block sm"></span>
          </div>
          <span class="theme-name"><v-icon size="15">mdi-weather-night</v-icon> Escuro (Mocha)</span>
        </button>
      </div>
    </div>

    <!-- ── Dados ────────────────────────────────────────────── -->
    <div v-if="aba === 'dados'" class="panel anim-in" style="--i:2">
      <div class="panel-head">
        <div>
          <div class="panel-title">Backup e dados</div>
          <div class="panel-sub">Exporte ou restaure seus atendimentos</div>
        </div>
      </div>

      <div class="data-actions">
        <button class="data-card" @click="exportar">
          <v-icon size="22" color="var(--c-primary)">mdi-download-outline</v-icon>
          <span class="data-title">Exportar backup</span>
          <span class="data-sub">Baixa um arquivo .json com tudo</span>
        </button>
        <button class="data-card" @click="$refs.fileInput.click()">
          <v-icon size="22" color="var(--c-info)">mdi-upload-outline</v-icon>
          <span class="data-title">Importar backup</span>
          <span class="data-sub">Restaura de um arquivo .json</span>
        </button>
        <input ref="fileInput" type="file" accept=".json" style="display:none" @change="importar" />
      </div>
    </div>

    <!-- Dialog procedimento -->
    <v-dialog v-model="dialogProc" max-width="400">
      <div class="proc-dialog">
        <div class="pd-head">
          <span class="pd-title">{{ procEdit.id ? 'Editar serviço' : 'Novo serviço' }}</span>
          <button class="detalhe-close" @click="dialogProc = false"><v-icon size="16" color="var(--c-text-faint)">mdi-close</v-icon></button>
        </div>
        <div class="pd-body">
          <div class="fld"><label>Nome</label><input v-model="procEdit.nome" type="text" placeholder="Ex: Volume Russo" /></div>
          <div class="pd-row">
            <div class="fld"><label>Valor (R$)</label><input v-model.number="procEdit.valor" type="number" placeholder="150" /></div>
            <div class="fld"><label>Duração (min)</label><input v-model.number="procEdit.duracao" type="number" placeholder="120" /></div>
          </div>
        </div>
        <div class="pd-foot">
          <button class="btn-ghost sm" @click="dialogProc = false">Cancelar</button>
          <button class="btn-primary" :disabled="!procEdit.nome || !procEdit.valor" @click="salvarProc">Salvar</button>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<script>
import { useProcedimentoStore } from '@/modulos/Configuracoes/Domain/Stores/procedimentoStore'
import { usePerfilNegocioStore } from '@/modulos/Configuracoes/Domain/Stores/perfilNegocioStore'
import { useTemaStore } from '@/modulos/Shared/Domain/Stores/useTemaStore'
import { useTema } from '@/modulos/Shared/Domain/Composables/useTema'
import { useAtendimentoStore } from '@/modulos/Atendimento/Domain/Stores/atendimentoStore'
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore'

export default {
  name: 'ConfiguracoesView',
  setup() {
    return {
      procedimentoStore: useProcedimentoStore(),
      perfilStore: usePerfilNegocioStore(),
      temaStore: useTemaStore(),
      atendimentoStore: useAtendimentoStore(),
      alertStore: useAlertStore(),
    }
  },
  data() {
    return {
      aba: 'servicos',
      tabs: [
        { key: 'servicos',  label: 'Serviços',   icon: 'mdi-spa-outline' },
        { key: 'estudio',   label: 'Estúdio',    icon: 'mdi-storefront-outline' },
        { key: 'aparencia', label: 'Aparência',  icon: 'mdi-palette-outline' },
        { key: 'dados',     label: 'Dados',      icon: 'mdi-database-outline' },
      ],
      perfil: {},
      salvo: false,
      dialogProc: false,
      procEdit: { id: null, nome: '', valor: null, duracao: 120 },
    }
  },
  computed: {
    temaAtual() { return this.temaStore.temaAtual },
  },
  created() {
    this.perfil = { ...this.perfilStore.$state }
  },
  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
    },
    abrirNovoProc() {
      this.procEdit = { id: null, nome: '', valor: null, duracao: 120 }
      this.dialogProc = true
    },
    abrirEditarProc(p) {
      this.procEdit = { ...p }
      this.dialogProc = true
    },
    salvarProc() {
      if (this.procEdit.id) {
        this.procedimentoStore.editar(this.procEdit.id, this.procEdit)
      } else {
        this.procedimentoStore.adicionar(this.procEdit)
      }
      this.dialogProc = false
      this.alertStore?.showSuccess?.('Serviço salvo!')
    },
    removerProc(p) {
      this.procedimentoStore.remover(p.id)
      this.alertStore?.showWarning?.(`"${p.nome}" removido`)
    },
    restaurar() {
      this.procedimentoStore.restaurarPadrao()
      this.alertStore?.showSuccess?.('Serviços padrão restaurados')
    },
    salvarPerfil() {
      this.perfilStore.atualizar(this.perfil)
      this.salvo = true
      setTimeout(() => { this.salvo = false }, 2000)
    },
    setTema(tema) {
      if (this.temaStore.temaAtual === tema) return
      const { alternarTema } = useTema()
      alternarTema()
    },
    exportar() {
      this.atendimentoStore.exportarBackup()
      this.alertStore?.showSuccess?.('Backup exportado!')
    },
    async importar(event) {
      const arquivo = event.target.files[0]
      if (!arquivo) return
      try {
        const r = await this.atendimentoStore.importarBackup(arquivo)
        this.alertStore?.showSuccess?.(`${r.importados} atendimento(s) restaurado(s)!`)
      } catch (e) {
        this.alertStore?.showError?.(e.message)
      }
      event.target.value = ''
    },
  },
}
</script>

<style scoped>
.config-view {
  padding: 22px 26px 40px;
  max-width: 920px;
  margin: 0 auto;
}
.view-header { margin-bottom: 18px; }
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem; font-weight: 700; color: var(--c-text); line-height: 1;
}
.page-subtitle { font-family: 'Nunito', sans-serif; font-size: 0.82rem; color: var(--c-text-soft); margin-top: 4px; }

/* Tabs */
.tabs {
  display: flex; gap: 4px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 4px; margin-bottom: 18px;
  box-shadow: var(--shadow-xs);
  overflow-x: auto;
}
.tab {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Nunito', sans-serif; font-size: 0.8rem; font-weight: 700;
  color: var(--c-text-soft); background: transparent; border: none;
  border-radius: var(--r-sm); padding: 8px 16px; cursor: pointer;
  white-space: nowrap; transition: all 0.15s;
}
.tab:hover { color: var(--c-text); background: var(--c-surface-hover); }
.tab.active { background: var(--c-primary); color: #fff; box-shadow: var(--shadow-sm); }

/* Panel */
.panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 22px;
  box-shadow: var(--shadow-sm);
}
.panel-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
}
.panel-title { font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; color: var(--c-text); }
.panel-sub { font-family: 'Nunito', sans-serif; font-size: 0.76rem; color: var(--c-text-soft); margin-top: 2px; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Nunito', sans-serif; font-size: 0.8rem; font-weight: 700;
  color: #fff; background: var(--c-primary); border: none;
  border-radius: var(--r-sm); padding: 9px 16px; cursor: pointer;
  box-shadow: var(--shadow-sm); transition: transform 0.15s, background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: var(--c-primary-dark); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700;
  color: var(--c-text-soft); background: transparent;
  border: 1px solid var(--c-border); border-radius: var(--r-sm);
  padding: 8px 14px; cursor: pointer; margin-top: 16px; transition: all 0.15s;
}
.btn-ghost.sm { margin-top: 0; }
.btn-ghost:hover { color: var(--c-text); background: var(--c-surface-hover); }

/* Proc list */
.proc-list { display: flex; flex-direction: column; gap: 8px; }
.proc-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border-soft);
  border-radius: var(--r-md);
  transition: border-color 0.15s, opacity 0.15s;
}
.proc-row.inativo { opacity: 0.5; }
.proc-row:hover { border-color: var(--c-border-strong); }
.proc-icon {
  width: 34px; height: 34px; border-radius: var(--r-sm);
  background: var(--c-primary-soft);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.proc-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.proc-nome { font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 700; color: var(--c-text); }
.proc-meta { font-family: 'Nunito', sans-serif; font-size: 0.7rem; color: var(--c-text-soft); }
.proc-valor { font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800; color: var(--c-primary); }
.proc-actions { display: flex; gap: 2px; }
.ic-btn {
  width: 30px; height: 30px; border-radius: var(--r-sm);
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.ic-btn:hover { background: var(--c-surface-hover); }
.ic-btn.danger:hover { background: var(--c-danger-soft); }

/* Form */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fld { display: flex; flex-direction: column; gap: 5px; }
.fld.full { grid-column: 1 / -1; }
.fld label {
  font-family: 'Nunito', sans-serif; font-size: 0.7rem; font-weight: 700;
  color: var(--c-text-soft); text-transform: uppercase; letter-spacing: 0.5px;
}
.fld input {
  font-family: 'Nunito', sans-serif; font-size: 0.88rem; color: var(--c-text);
  background: var(--c-surface);
  border: 1px solid var(--c-border-strong); border-radius: var(--r-sm);
  padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.fld input::placeholder { color: var(--c-text-faint); }
.fld input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px var(--c-primary-softer); }

.save-row { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 18px; }
.saved-msg {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700; color: var(--c-success);
}

/* Theme cards */
.theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.theme-card {
  background: var(--c-surface-2);
  border: 2px solid var(--c-border); border-radius: var(--r-md);
  padding: 14px; cursor: pointer; transition: border-color 0.15s, transform 0.15s;
  display: flex; flex-direction: column; gap: 10px;
}
.theme-card:hover { transform: translateY(-2px); }
.theme-card.active { border-color: var(--c-primary); }
.theme-preview {
  height: 88px; border-radius: var(--r-sm); padding: 12px;
  display: flex; flex-direction: column; gap: 8px;
}
.theme-preview.light { background: #F4EEE6; }
.theme-preview.dark { background: #1E1A17; }
.tp-bar { height: 12px; border-radius: 4px; background: #C57F4B; width: 40%; }
.theme-preview.dark .tp-bar { background: #E0A165; }
.tp-block { height: 18px; border-radius: 5px; background: #FCF9F5; box-shadow: var(--shadow-xs); }
.theme-preview.dark .tp-block { background: #29231E; }
.tp-block.sm { width: 60%; }
.theme-name {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Nunito', sans-serif; font-size: 0.84rem; font-weight: 700; color: var(--c-text);
}

/* Data */
.data-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.data-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
  background: var(--c-surface-2); border: 1px solid var(--c-border-soft);
  border-radius: var(--r-md); padding: 18px; cursor: pointer; text-align: left;
  transition: transform 0.15s, border-color 0.15s;
}
.data-card:hover { transform: translateY(-2px); border-color: var(--c-border-strong); }
.data-title { font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--c-text); margin-top: 4px; }
.data-sub { font-family: 'Nunito', sans-serif; font-size: 0.74rem; color: var(--c-text-soft); }

/* Proc dialog */
.proc-dialog { background: var(--c-surface); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-lg); }
.pd-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px; border-bottom: 1px solid var(--c-border-soft);
}
.pd-title { font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800; color: var(--c-text); }
.detalhe-close {
  width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--c-border);
  background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.detalhe-close:hover { background: var(--c-surface-hover); }
.pd-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.pd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pd-foot {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 14px 18px; border-top: 1px solid var(--c-border-soft); background: var(--c-surface-2);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .form-grid, .theme-grid, .data-actions, .pd-row { grid-template-columns: 1fr; }
}
</style>
