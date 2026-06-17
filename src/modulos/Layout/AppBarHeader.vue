<template>
  <v-app-bar app color="white" elevation="0" height="56" class="app-header">

    <!-- Logo -->
    <div class="app-logo ms-5">
      <div class="logo-mark">
        <v-icon color="laranja" size="17">mdi-spa</v-icon>
      </div>
      <span class="logo-text">Estética Pro</span>
    </div>

    <v-spacer />

    <!-- Navegação -->
    <div class="nav-links">
      <button
        class="nav-link"
        :class="{ active: $route.path === '/atendimento' }"
        @click="$router.push('/atendimento')"
      >
        Atendimentos
      </button>
    </div>

    <v-spacer />

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
          <span class="user-name">{{ usuario?.nome || 'Usuário' }}</span>
          <v-icon size="14" color="#C0C0C0">mdi-chevron-down</v-icon>
        </div>
      </template>

      <div class="dropdown-card">
        <!-- User info -->
        <div class="dropdown-info">
          <div class="dropdown-avatar-lg">{{ userInitial }}</div>
          <div class="dropdown-info-text">
            <div class="dropdown-name">{{ usuario?.nome || 'Usuário' }}</div>
            <div class="dropdown-email">{{ usuario?.email || 'sem email' }}</div>
          </div>
        </div>

        <div class="dropdown-sep"></div>

        <button class="dropdown-item" @click="emitAbreConfiguracoes">
          <v-icon size="15" color="#888">mdi-cog-outline</v-icon>
          Configurações
        </button>

        <button class="dropdown-item danger" @click="emitLogout">
          <v-icon size="15" color="#DC2626">mdi-logout</v-icon>
          Sair
        </button>
      </div>
    </v-menu>

  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'

export default {
  name: 'AppBarHeader',
  props: {
    telasVisiveis: { type: Array, default: () => [] }
  },
  computed: {
    usuario() {
      return useAuthStore().user
    },
    userInitial() {
      return (this.usuario?.nome || 'U').charAt(0).toUpperCase()
    }
  },
  methods: {
    emitLogout() { this.$emit('onLogout') },
    emitAbreConfiguracoes() { this.$emit('onAbreConfiguracoes') }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap');

/* ── Header ─────────────────────────────────────────────── */
.app-header {
  border-bottom: 1px solid #F0F0F0 !important;
  box-shadow: 0 1px 0 #F0F0F0, 0 2px 8px rgba(0,0,0,0.04) !important;
}

/* ── Logo ───────────────────────────────────────────────── */
.app-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  user-select: none;
}

.logo-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(234, 168, 59, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1A1A1A;
  letter-spacing: -0.2px;
}

/* ── Nav ────────────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #AAA;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  transition: color 0.1s ease;
  position: relative;
  letter-spacing: 0.1px;
}

.nav-link:hover {
  color: #555;
}

.nav-link.active {
  color: #C07A28;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background: #D68B36;
  border-radius: 1px;
}

/* ── User trigger ───────────────────────────────────────── */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  padding: 4px 8px 4px 4px;
  border-radius: 24px;
  border: 1px solid #EFEFEF;
  background: #FAFAFA;
  transition: border-color 0.12s ease, background 0.12s ease;
  user-select: none;
}

.user-trigger:hover {
  border-color: #E0E0E0;
  background: #F5F5F5;
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EAA83B 0%, #D66236 100%);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #333;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Dropdown ───────────────────────────────────────────── */
.dropdown-card {
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05);
  min-width: 210px;
  overflow: hidden;
  animation: popIn 0.15s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #FAFAFA;
}

.dropdown-avatar-lg {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EAA83B, #D66236);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-info-text {
  min-width: 0;
}

.dropdown-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1A1A1A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-family: 'Nunito', sans-serif;
  font-size: 0.68rem;
  color: #BBB;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-sep {
  height: 1px;
  background: #F0F0F0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #444;
  text-align: left;
  transition: background 0.1s ease;
}

.dropdown-item:hover {
  background: #F5F5F5;
}

.dropdown-item.danger {
  color: #DC2626;
}

.dropdown-item.danger:hover {
  background: #FFF5F5;
}
</style>
