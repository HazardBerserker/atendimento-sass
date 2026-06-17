<template>
  <div class="pwa-layer">
    <!-- Atualização disponível -->
    <transition name="slide-up">
      <div v-if="pwa.temAtualizacao" class="pwa-banner update">
        <div class="pwa-ico"><v-icon size="18" color="#fff">mdi-rocket-launch-outline</v-icon></div>
        <div class="pwa-text">
          <span class="pwa-title">Nova versão disponível</span>
          <span class="pwa-sub">Atualize para ter as últimas melhorias</span>
        </div>
        <button class="pwa-action" @click="pwa.aplicarAtualizacao()">Atualizar</button>
      </div>
    </transition>

    <!-- Instalar (Android/Chromium) -->
    <transition name="slide-up">
      <div v-if="mostrarInstalar" class="pwa-banner install">
        <div class="pwa-ico brand"><v-icon size="18" color="#fff">mdi-cellphone-arrow-down</v-icon></div>
        <div class="pwa-text">
          <span class="pwa-title">Instalar Estética Pro</span>
          <span class="pwa-sub">Use como aplicativo, em tela cheia</span>
        </div>
        <button class="pwa-action" @click="instalar">Instalar</button>
        <button class="pwa-close" @click="dispensarInstalar"><v-icon size="15" color="currentColor">mdi-close</v-icon></button>
      </div>
    </transition>

    <!-- Dica iOS (sem prompt nativo) -->
    <transition name="slide-up">
      <div v-if="pwa.deveMostrarDicaIOS && !iosDispensadoSessao" class="pwa-banner ios">
        <div class="pwa-ico brand"><v-icon size="18" color="#fff">mdi-apple</v-icon></div>
        <div class="pwa-text">
          <span class="pwa-title">Adicionar à Tela de Início</span>
          <span class="pwa-sub">
            Toque em <v-icon size="14" color="var(--c-primary)">mdi-export-variant</v-icon>
            e depois em "Adicionar à Tela de Início"
          </span>
        </div>
        <button class="pwa-close" @click="dispensarIOS"><v-icon size="15" color="currentColor">mdi-close</v-icon></button>
      </div>
    </transition>
  </div>
</template>

<script>
import { usePwaStore } from '@/modulos/Shared/Domain/Stores/pwaStore'

export default {
  name: 'PwaPrompt',
  setup() {
    return { pwa: usePwaStore() }
  },
  data() {
    return { installDispensado: false, iosDispensadoSessao: false }
  },
  computed: {
    mostrarInstalar() {
      return this.pwa.podeInstalar && !this.installDispensado && !this.pwa.standalone
    },
  },
  methods: {
    async instalar() {
      await this.pwa.instalar()
    },
    dispensarInstalar() {
      this.installDispensado = true
    },
    dispensarIOS() {
      this.iosDispensadoSessao = true
      this.pwa.dispensarIOS()
    },
  },
}
</script>

<style scoped>
.pwa-layer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 12px calc(12px + env(safe-area-inset-bottom));
  pointer-events: none;
}

.pwa-banner {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 460px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: var(--shadow-lg);
}

.pwa-ico {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--c-text-soft);
}
.pwa-ico.brand { background: linear-gradient(135deg, var(--c-primary), var(--c-rose)); }
.update .pwa-ico { background: linear-gradient(135deg, var(--c-success), #3C7D59); }

.pwa-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.pwa-title {
  font-family: 'Nunito', sans-serif;
  font-size: 0.86rem;
  font-weight: 800;
  color: var(--c-text);
}
.pwa-sub {
  font-family: 'Nunito', sans-serif;
  font-size: 0.72rem;
  color: var(--c-text-soft);
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
}

.pwa-action {
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  color: #fff;
  background: var(--c-primary);
  border: none;
  border-radius: 10px;
  padding: 9px 16px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.15s;
}
.pwa-action:hover { background: var(--c-primary-dark); transform: translateY(-1px); }
.update .pwa-action { background: var(--c-success); }

.pwa-close {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--c-text-faint);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.pwa-close:hover { background: var(--c-surface-hover); }

/* Transições */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
