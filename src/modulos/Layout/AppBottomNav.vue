<template>
  <div class="bottom-nav-wrap">
    <!-- Botão de ação flutuante (novo atendimento) -->
    <button class="bn-fab" @click="novoAtendimento" aria-label="Novo atendimento">
      <v-icon size="26" color="#fff">mdi-plus</v-icon>
    </button>

    <!-- Barra de abas -->
    <nav class="bottom-nav">
      <button
        v-for="link in links"
        :key="link.path"
        class="bn-item"
        :class="{ active: ativo(link.path) }"
        @click="ir(link.path)"
      >
        <v-icon size="22">{{ ativo(link.path) ? link.iconAtivo : link.icon }}</v-icon>
        <span>{{ link.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppBottomNav',
  data() {
    return {
      links: [
        { path: '/atendimento',   label: 'Agenda',   icon: 'mdi-calendar-blank-outline',   iconAtivo: 'mdi-calendar-heart' },
        { path: '/clientes',      label: 'Clientes', icon: 'mdi-account-multiple-outline', iconAtivo: 'mdi-account-multiple' },
        { path: '/configuracoes', label: 'Ajustes',  icon: 'mdi-tune-variant',             iconAtivo: 'mdi-tune-vertical-variant' },
      ],
    }
  },
  methods: {
    ativo(path) { return this.$route.path === path },
    ir(path) {
      if (this.$route.path !== path) this.$router.push(path)
    },
    novoAtendimento() {
      if (this.$route.path !== '/atendimento') {
        this.$router.push('/atendimento').then(() => {
          this.$nextTick(() => this.emitter?.emit('abrir-novo-atendimento'))
        })
      } else {
        this.emitter?.emit('abrir-novo-atendimento')
      }
    },
  },
}
</script>

<style scoped>
.bottom-nav-wrap {
  display: none; /* só em tablet/celular (ver media query) */
}

.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(10px + env(safe-area-inset-bottom));
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: calc(100% - 24px);
  max-width: 460px;
  height: 64px;
  padding: 0 8px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 22px;
  box-shadow: var(--shadow-lg);
}

.bn-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  color: var(--c-text-soft);
  border-radius: 14px;
  transition: color 0.18s ease, transform 0.15s ease;
}
.bn-item span {
  font-family: 'Nunito', sans-serif;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.bn-item:active { transform: scale(0.9); }
.bn-item.active { color: var(--c-primary); }
.bn-item.active span { color: var(--c-primary); }

/* FAB flutuante, ancorado acima da barra (à direita) */
.bn-fab {
  position: fixed;
  right: 18px;
  bottom: calc(86px + env(safe-area-inset-bottom));
  z-index: 2600;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--c-primary), var(--c-rose));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(197, 127, 75, 0.5);
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s;
}
.bn-fab:hover { box-shadow: 0 10px 28px rgba(197, 127, 75, 0.6); }
.bn-fab:active { transform: scale(0.9); }

/* App-mode: tablets e celulares */
@media (max-width: 1024px) {
  .bottom-nav-wrap { display: block; }
}
</style>
