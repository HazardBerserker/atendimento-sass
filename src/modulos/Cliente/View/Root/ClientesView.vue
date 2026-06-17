<template>
  <div class="clientes-view">

    <!-- Header -->
    <div class="view-header anim-in" style="--i:0">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Sua base de clientes e histórico de atendimentos</p>
      </div>
      <div class="search-box">
        <v-icon size="16" color="var(--c-text-faint)">mdi-magnify</v-icon>
        <input v-model="busca" type="text" placeholder="Buscar cliente..." class="search-input" />
        <button v-if="busca" class="search-clear" @click="busca = ''">
          <v-icon size="14" color="var(--c-text-faint)">mdi-close</v-icon>
        </button>
      </div>
    </div>

    <!-- Resumo -->
    <div class="resumo-row anim-in" style="--i:1">
      <div class="resumo-card">
        <span class="resumo-value">{{ clientes.length }}</span>
        <span class="resumo-label">Clientes</span>
      </div>
      <div class="resumo-card">
        <span class="resumo-value">{{ clientesRecorrentes }}</span>
        <span class="resumo-label">Recorrentes</span>
      </div>
      <div class="resumo-card">
        <span class="resumo-value">{{ formatCurrency(ticketMedioGeral) }}</span>
        <span class="resumo-label">Ticket médio</span>
      </div>
      <div class="resumo-card">
        <span class="resumo-value">{{ formatCurrency(totalGeral) }}</span>
        <span class="resumo-label">Receita acumulada</span>
      </div>
    </div>

    <!-- Lista vazia -->
    <div v-if="clientes.length === 0" class="empty-state anim-in" style="--i:2">
      <div class="empty-icon"><v-icon size="40" color="var(--c-primary)">mdi-account-heart-outline</v-icon></div>
      <p class="empty-title">Nenhum cliente ainda</p>
      <span class="empty-sub">Os clientes aparecem aqui automaticamente conforme você cria atendimentos.</span>
      <button class="empty-btn" @click="$router.push('/atendimento')">
        <v-icon size="15">mdi-plus</v-icon> Criar atendimento
      </button>
    </div>

    <div v-else-if="clientesFiltrados.length === 0" class="empty-state anim-in" style="--i:2">
      <div class="empty-icon"><v-icon size="36" color="var(--c-text-faint)">mdi-magnify-close</v-icon></div>
      <p class="empty-title">Nenhum resultado</p>
      <span class="empty-sub">Não encontramos clientes com "{{ busca }}".</span>
    </div>

    <!-- Grid de clientes -->
    <div v-else class="clientes-grid">
      <div
        v-for="(c, idx) in clientesFiltrados"
        :key="c.nome"
        class="cliente-card anim-in"
        :style="{ '--i': idx + 2 }"
        @click="abrirDetalhe(c)"
      >
        <div class="cliente-top">
          <div class="cliente-avatar" :style="{ background: avatarColor(c.nome) }">{{ inicial(c.nome) }}</div>
          <div class="cliente-id">
            <span class="cliente-nome">{{ c.nome }}</span>
            <span class="cliente-tel">{{ c.telefone || 'Sem telefone' }}</span>
          </div>
          <span v-if="c.total >= 3" class="tag-vip">VIP</span>
        </div>

        <div class="cliente-stats">
          <div class="cstat">
            <span class="cstat-num">{{ c.total }}</span>
            <span class="cstat-lbl">visitas</span>
          </div>
          <div class="cstat">
            <span class="cstat-num">{{ formatCurrency(c.totalGasto) }}</span>
            <span class="cstat-lbl">gasto</span>
          </div>
          <div class="cstat">
            <span class="cstat-num">{{ formatDataCurta(c.ultimaData) }}</span>
            <span class="cstat-lbl">última</span>
          </div>
        </div>

        <div class="cliente-foot">
          <span class="proc-fav">
            <v-icon size="12" color="var(--c-primary)">mdi-star-outline</v-icon>
            {{ c.procedimentoFavorito }}
          </span>
          <a
            v-if="c.telefone"
            class="whats-btn"
            :href="whatsLink(c.telefone)"
            target="_blank"
            @click.stop
          >
            <v-icon size="13">mdi-whatsapp</v-icon>
          </a>
        </div>
      </div>
    </div>

    <!-- Detalhe -->
    <v-dialog v-model="dialogDetalhe" max-width="440" scroll-strategy="none" transition="dialog-bottom-transition">
      <div v-if="clienteSelecionado" class="detalhe-card">
        <div class="detalhe-header">
          <div class="cliente-avatar lg" :style="{ background: avatarColor(clienteSelecionado.nome) }">
            {{ inicial(clienteSelecionado.nome) }}
          </div>
          <div>
            <div class="detalhe-nome">{{ clienteSelecionado.nome }}</div>
            <div class="detalhe-tel">{{ clienteSelecionado.telefone || 'Sem telefone' }}</div>
          </div>
          <button class="detalhe-close" @click="dialogDetalhe = false">
            <v-icon size="16" color="var(--c-text-faint)">mdi-close</v-icon>
          </button>
        </div>

        <div class="detalhe-body">
          <div class="detalhe-label">Histórico de atendimentos</div>
          <div class="hist-list">
            <div v-for="(a, i) in clienteSelecionado.historico" :key="i" class="hist-row">
              <div class="hist-left">
                <span class="hist-proc">{{ a.procedimento }}</span>
                <span class="hist-data">{{ formatDataLonga(a.data) }} · {{ a.hora }}</span>
              </div>
              <div class="hist-right">
                <span class="hist-valor">{{ formatCurrency(a.valor) }}</span>
                <span class="hist-badge" :class="`b-${a.status}`">{{ a.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detalhe-foot">
          <a
            v-if="clienteSelecionado.telefone"
            class="detalhe-whats"
            :href="whatsLink(clienteSelecionado.telefone)"
            target="_blank"
          >
            <v-icon size="15">mdi-whatsapp</v-icon> Conversar no WhatsApp
          </a>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<script>
import { useAtendimentoStore } from '@/modulos/Atendimento/Domain/Stores/atendimentoStore'

export default {
  name: 'ClientesView',
  setup() {
    return { atendimentoStore: useAtendimentoStore() }
  },
  data() {
    return {
      busca: '',
      dialogDetalhe: false,
      clienteSelecionado: null,
    }
  },
  computed: {
    clientes() {
      const mapa = {}
      for (const a of this.atendimentoStore.atendimentos) {
        if (a.status === 'cancelado') continue
        const chave = a.cliente?.trim()
        if (!chave) continue
        if (!mapa[chave]) {
          mapa[chave] = {
            nome: chave, telefone: a.telefone || '', total: 0,
            totalGasto: 0, ultimaData: a.data, historico: [], _procs: {},
          }
        }
        const c = mapa[chave]
        c.total++
        c.totalGasto += Number(a.valor) || 0
        c.historico.push(a)
        c._procs[a.procedimento] = (c._procs[a.procedimento] || 0) + 1
        if (a.data > c.ultimaData) c.ultimaData = a.data
        if (!c.telefone && a.telefone) c.telefone = a.telefone
      }
      return Object.values(mapa).map(c => {
        c.historico.sort((x, y) => (y.data + y.hora).localeCompare(x.data + x.hora))
        c.procedimentoFavorito = Object.entries(c._procs).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
        return c
      }).sort((a, b) => b.totalGasto - a.totalGasto)
    },
    clientesFiltrados() {
      const t = this.busca.trim().toLowerCase()
      if (!t) return this.clientes
      return this.clientes.filter(c =>
        c.nome.toLowerCase().includes(t) || c.telefone.includes(t)
      )
    },
    clientesRecorrentes() {
      return this.clientes.filter(c => c.total >= 2).length
    },
    totalGeral() {
      return this.clientes.reduce((t, c) => t + c.totalGasto, 0)
    },
    ticketMedioGeral() {
      const visitas = this.clientes.reduce((t, c) => t + c.total, 0)
      return visitas ? this.totalGeral / visitas : 0
    },
  },
  methods: {
    formatCurrency(v) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
    },
    inicial(nome) { return (nome || '?').charAt(0).toUpperCase() },
    avatarColor(nome) {
      const cores = [
        'linear-gradient(135deg,#C57F4B,#A9663A)',
        'linear-gradient(135deg,#C16C61,#A8554B)',
        'linear-gradient(135deg,#5B7FB5,#46618C)',
        'linear-gradient(135deg,#4F9D72,#3C7D59)',
        'linear-gradient(135deg,#B07BA8,#8A5D84)',
      ]
      let h = 0
      for (let i = 0; i < nome.length; i++) h = nome.charCodeAt(i) + ((h << 5) - h)
      return cores[Math.abs(h) % cores.length]
    },
    formatDataCurta(d) {
      if (!d) return '—'
      const [, m, dia] = d.split('-')
      return `${dia}/${m}`
    },
    formatDataLonga(d) {
      if (!d) return ''
      const [y, m, dia] = d.split('-').map(Number)
      return new Date(y, m - 1, dia).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    whatsLink(tel) {
      const num = (tel || '').replace(/\D/g, '')
      return `https://wa.me/55${num}`
    },
    abrirDetalhe(c) {
      this.clienteSelecionado = c
      this.dialogDetalhe = true
    },
  },
}
</script>

<style scoped>
.clientes-view {
  padding: 22px 26px 40px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--c-text);
  line-height: 1;
}
.page-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  color: var(--c-text-soft);
  margin-top: 4px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: 8px 14px;
  min-width: 260px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-box:focus-within {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-softer);
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  color: var(--c-text);
  width: 100%;
}
.search-input::placeholder { color: var(--c-text-faint); }
.search-clear { background: none; border: none; cursor: pointer; display: flex; padding: 0; }

/* Resumo */
.resumo-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}
.resumo-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: var(--shadow-xs);
  min-width: 0;
  overflow: hidden;
}
.resumo-value {
  font-family: 'Nunito', sans-serif;
  font-size: clamp(0.95rem, 3.4vw, 1.25rem);
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
}
.resumo-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--c-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* Grid */
.clientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.cliente-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.cliente-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-border-strong);
}

.cliente-top {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
}
.cliente-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}
.cliente-avatar.lg { width: 52px; height: 52px; font-size: 1.2rem; }
.cliente-id { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.cliente-nome {
  font-family: 'Nunito', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cliente-tel {
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  color: var(--c-text-soft);
}
.tag-vip {
  font-family: 'Nunito', sans-serif;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--c-rose);
  background: var(--c-rose-soft);
  border: 1px solid var(--c-rose-border);
  border-radius: 8px;
  padding: 2px 7px;
}

.cliente-stats {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid var(--c-border-soft);
  border-bottom: 1px solid var(--c-border-soft);
}
.cstat { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; }
.cstat-num { font-family: 'Nunito', sans-serif; font-size: 0.85rem; font-weight: 800; color: var(--c-text); }
.cstat-lbl { font-family: 'Nunito', sans-serif; font-size: 0.62rem; color: var(--c-text-faint); text-transform: uppercase; letter-spacing: 0.4px; }

.cliente-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.proc-fav {
  display: flex; align-items: center; gap: 4px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-text-soft);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.whats-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--c-success-soft);
  color: var(--c-success);
  flex-shrink: 0;
  transition: transform 0.15s;
}
.whats-btn:hover { transform: scale(1.12); }

/* Empty */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 60px 20px; text-align: center;
}
.empty-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--c-primary-soft);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 6px;
}
.empty-title { font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 700; color: var(--c-text); }
.empty-sub { font-family: 'Nunito', sans-serif; font-size: 0.82rem; color: var(--c-text-soft); max-width: 340px; }
.empty-btn {
  margin-top: 12px;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 700;
  color: #fff; background: var(--c-primary); border: none;
  border-radius: var(--r-sm); padding: 9px 18px; cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s, background 0.15s;
}
.empty-btn:hover { background: var(--c-primary-dark); transform: translateY(-1px); }

/* Detalhe dialog */
.detalhe-card {
  background: var(--c-surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  font-family: 'Nunito', sans-serif;
}
.detalhe-header {
  display: flex; align-items: center; gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--c-border-soft);
  position: relative;
}
.detalhe-nome { font-size: 1.05rem; font-weight: 800; color: var(--c-text); }
.detalhe-tel { font-size: 0.78rem; color: var(--c-text-soft); }
.detalhe-close {
  position: absolute; top: 16px; right: 16px;
  width: 28px; height: 28px; border-radius: 8px;
  border: 1px solid var(--c-border); background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.detalhe-close:hover { background: var(--c-surface-hover); }

.detalhe-body { padding: 16px 20px; max-height: 320px; overflow-y: auto; }
.detalhe-label {
  font-size: 0.66rem; font-weight: 800; color: var(--c-text-faint);
  text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 10px;
}
.hist-list { display: flex; flex-direction: column; gap: 8px; }
.hist-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: var(--r-sm);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border-soft);
}
.hist-left { display: flex; flex-direction: column; gap: 2px; }
.hist-proc { font-size: 0.84rem; font-weight: 700; color: var(--c-text); }
.hist-data { font-size: 0.7rem; color: var(--c-text-soft); }
.hist-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.hist-valor { font-size: 0.84rem; font-weight: 800; color: var(--c-text); }
.hist-badge {
  font-size: 0.6rem; font-weight: 700; padding: 1px 7px; border-radius: 8px;
  text-transform: capitalize;
}
.b-agendado { background: var(--c-info-soft); color: var(--c-info); }
.b-confirmado { background: var(--c-warning-soft); color: var(--c-warning); }
.b-realizado { background: var(--c-success-soft); color: var(--c-success); }
.b-cancelado { background: var(--c-danger-soft); color: var(--c-danger); }

.detalhe-foot { padding: 14px 20px; border-top: 1px solid var(--c-border-soft); }
.detalhe-whats {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 10px; border-radius: var(--r-sm);
  background: var(--c-success); color: #fff;
  font-size: 0.85rem; font-weight: 700;
  transition: filter 0.15s;
}
.detalhe-whats:hover { filter: brightness(1.05); }

/* Responsivo */
@media (max-width: 680px) {
  .resumo-row { grid-template-columns: repeat(2, 1fr); }
  .search-box { width: 100%; }
  .view-header { flex-direction: column; align-items: stretch; }
}
</style>
