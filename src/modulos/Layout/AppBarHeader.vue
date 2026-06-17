<template>
  <v-app-bar app color="surface" elevation="0" height="60" class="app-header">

    <!-- Logo -->
    <div class="app-logo ms-5" @click="$router.push('/atendimento')">
      <div class="logo-mark">
        <v-icon color="laranja" size="18">mdi-spa</v-icon>
      </div>
      <span class="logo-text">{{ perfil.nomeEstudio || 'Estética Pro' }}</span>
    </div>

    <v-spacer />

    <!-- Navegação -->
    <nav class="nav-links">
      <button
        v-for="link in links"
        :key="link.path"
        class="nav-link"
        :class="{ active: $route.path === link.path }"
        @click="$router.push(link.path)"
      >
        <v-icon size="15">{{ link.icon }}</v-icon>
        <span>{{ link.label }}</span>
      </button>
    </nav>

    <v-spacer />

    <!-- Tema toggle -->
    <button class="theme-toggle me-2" :title="ehEscuro ? 'Tema claro' : 'Tema escuro'" @click="toggleTema">
      <v-icon size="17" color="var(--c-text-soft)">{{ ehEscuro ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    </button>

    <!-- Usuário -->
    <v-menu
      :scrim="false"
      :close-on-content-click="true"
      location="bottom end"
      offset="6"
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="user-trigger me-5">
          <div class="user-avatar">{{ userInitial }}</div>
          <span class="user-name">{{ perfil.profissional || usuario?.nome || 'Usuário' }}</span>
          <v-icon size="14" color="var(--c-text-faint)">mdi-chevron-down</v-icon>
        </div>
      </template>

      <div class="dropdown-card">
        <div class="dropdown-info">
          <div class="dropdown-avatar-lg">{{ userInitial }}</div>
          <div class="dropdown-info-text">
            <div class="dropdown-name">{{ perfil.profissional || usuario?.nome || 'Usuário' }}</div>
            <div class="dropdown-email">{{ usuario?.email || perfil.nomeEstudio || 'Estética Pro' }}</div>
          </div>
        </div>

        <div class="dropdown-sep"></div>

        <button class="dropdown-item" @click="$router.push('/configuracoes')">
          <v-icon size="15" color="var(--c-text-soft)">mdi-cog-outline</v-icon>
          Configurações
        </button>

        <button class="dropdown-item danger" @click="emitLogout">
          <v-icon size="15" color="var(--c-danger)">mdi-logout</v-icon>
          Sair
        </button>
      </div>
    </v-menu>

  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
import { usePerfilNegocioStore } from '@/modulos/Configuracoes/Domain/Stores/perfilNegocioStore'
import { useTemaStore } from '@/modulos/Shared/Domain/Stores/useTemaStore'
import { useTema } from '@/modulos/Shared/Domain/Composables/useTema'

export default {
  name: 'AppBarHeader',
  props: {
    telasVisiveis: { type: Array, default: () => [] }
  },
  setup() {
    return {
      perfilStore: usePerfilNegocioStore(),
      temaStore: useTemaStore(),
    }
  },
  data() {
    return {
      links: [
        { path: '/atendimento',  label: 'Atendimentos', icon: 'mdi-calendar-heart' },
        { path: '/clientes',     label: 'Clientes',     icon: 'mdi-account-multiple-outline' },
        { path: '/configuracoes',label: 'Ajustes',      icon: 'mdi-tune-variant' },
      ]
    }
  },
  computed: {
    perfil() { return this.perfilStore.$state },
    ehEscuro() { return this.temaStore.temaAtual === 'dark' },
    usuario() { return useAuthStore().user },
    userInitial() {
      const base = this.perfil.profissional || this.usuario?.nome || 'U'
      return base.charAt(0).toUpperCase()
    }
  },
  methods: {
    toggleTema() {
      const { alternarTema } = useTema()
      alternarTema()
    },
    emitLogout() { this.$emit('onLogout') },
    emitAbreConfiguracoes() { this.$emit('onAbreConfiguracoes') }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap');

/* ── Header ─────────────────────────────────────────────── */
.app-header {
  border-bottom: 1px solid var(--c-border) !important;
  box-shadow: var(--shadow-xs) !important;
  background: var(--c-surface) !important;
}

/* ── Logo ───────────────────────────────────────────────── */
.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  cursor: pointer;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--c-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}
.app-logo:hover .logo-mark { transform: rotate(-8deg) scale(1.05); }

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--c-text);
  letter-spacing: -0.2px;
}

/* ── Nav ────────────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border-soft);
  border-radius: 22px;
  padding: 4px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--c-text-soft);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 18px;
  transition: color 0.18s ease, background 0.18s ease;
  letter-spacing: 0.1px;
}

.nav-link:hover { color: var(--c-text); }

.nav-link.active {
  color: #fff;
  background: var(--c-primary);
  box-shadow: var(--shadow-sm);
}

/* ── Theme toggle ───────────────────────────────────────── */
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: var(--c-surface-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.18s;
}
.theme-toggle:hover { background: var(--c-surface-hover); transform: rotate(15deg); }

/* ── User trigger ───────────────────────────────────────── */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px 4px 4px;
  border-radius: 24px;
  border: 1px solid var(--c-border);
  background: var(--c-surface-2);
  transition: border-color 0.15s ease, background 0.15s ease;
  user-select: none;
}

.user-trigger:hover {
  border-color: var(--c-border-strong);
  background: var(--c-surface-hover);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-rose) 100%);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-text);
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Dropdown ───────────────────────────────────────────── */
.dropdown-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-lg);
  min-width: 220px;
  overflow: hidden;
  animation: popIn 0.16s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: var(--c-surface-2);
}

.dropdown-avatar-lg {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary), var(--c-rose));
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-info-text { min-width: 0; }

.dropdown-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-family: 'Nunito', sans-serif;
  font-size: 0.7rem;
  color: var(--c-text-soft);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-sep { height: 1px; background: var(--c-border-soft); }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--c-text);
  text-align: left;
  transition: background 0.12s ease;
}

.dropdown-item:hover { background: var(--c-surface-hover); }
.dropdown-item.danger { color: var(--c-danger); }
.dropdown-item.danger:hover { background: var(--c-danger-soft); }

/* ── Responsivo / App-mode ──────────────────────────────── */
/* Em tablet e celular a navegação vai para a barra inferior */
@media (max-width: 1024px) {
  .nav-links { display: none; }
}

@media (max-width: 560px) {
  .user-name { display: none; }
  .app-logo { margin-inline-start: 16px !important; }
}
</style>
