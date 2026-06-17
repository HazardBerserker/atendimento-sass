<template>
  <div class="not-found-container">
    <div class="content-wrapper">
      <v-scale-transition mode="out-in">
        <div v-show="mostrarConteudo" class="not-found-content">
          <v-fade-transition mode="out-in">
            <div v-show="mostrarNumero" class="number-section">
              <v-icon size="80" color="#EAA83B" class="mb-4">mdi-emoticon-sad-outline</v-icon>
              <h1 class="error-number">404</h1>
            </div>
          </v-fade-transition>

          <v-slide-y-transition mode="out-in">
            <div v-show="mostrarTexto" class="message-section">
              <h2 class="error-title">Página não encontrada</h2>
              <p class="error-subtitle">A página que você está procurando não existe ou foi removida.</p>
            </div>
          </v-slide-y-transition>

          <v-expand-transition>
            <div v-show="mostrarBotoes" class="buttons-section">
              <v-btn
                size="large"
                color="laranjaAccentDarken"
                class="action-btn"
                prepend-icon="mdi-arrow-left"
                @click="$router.back()"
              >
                Voltar
              </v-btn>

              <v-btn
                size="large"
                variant="outlined"
                color="laranja"
                class="action-btn-outlined"
                prepend-icon="mdi-home"
                @click="$router.push('/home')"
              >
                Ir para Início
              </v-btn>
            </div>
          </v-expand-transition>
        </div>
      </v-scale-transition>
    </div>
  </div>
</template>

<script>
import { sleep } from '@/modulos/Shared/Domain/Helpers/sleep'

export default {
  name: 'NotFound',
  data() {
    return {
      mostrarConteudo: false,
      mostrarNumero: false,
      mostrarTexto: false,
      mostrarBotoes: false
    };
  },
  async mounted() {
    await this.iniciarAnimacoes()
  },
  methods: {
    async iniciarAnimacoes() {
      await sleep(100)
      this.mostrarConteudo = true
      await sleep(200)
      this.mostrarNumero = true
      await sleep(300)
      this.mostrarTexto = true
      await sleep(300)
      this.mostrarBotoes = true
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #F0C06A 0%, #EAA83B 50%, #EB6C3B 100%);
  position: relative;
  overflow: hidden;
}

.not-found-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  background-repeat: repeat;
  opacity: 0.3;
  mix-blend-mode: overlay;
}

.not-found-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 4rem 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.number-section {
  margin-bottom: 2rem;
}

.error-number {
  font-family: 'Playfair Display', serif;
  font-size: 8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #EAA83B 0%, #EB6C3B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.message-section {
  margin-bottom: 3rem;
}

.error-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.error-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

.buttons-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  min-width: 200px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 12px;
  background: #D66236 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(214, 98, 54, 0.3);
  transition: all 0.3s ease;
}

.action-btn:hover {
  box-shadow: 0 6px 16px rgba(214, 98, 54, 0.4);
  transform: translateY(-2px);
}

.action-btn-outlined {
  min-width: 200px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 12px;
  border-width: 2px;
  transition: all 0.3s ease;
}

.action-btn-outlined:hover {
  background: rgba(234, 168, 59, 0.1);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 640px) {
  .not-found-content {
    padding: 3rem 2rem;
  }

  .error-number {
    font-size: 6rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-subtitle {
    font-size: 0.9rem;
  }

  .buttons-section {
    width: 100%;
  }

  .action-btn,
  .action-btn-outlined {
    width: 100%;
    min-width: auto;
  }
}
</style>
