<template>
  <div class="login-container">
    <!-- Left Side - Branding -->
    <div class="left-side">
      <v-fade-transition mode="out-in">
        <div class="brand-content" :key="fraseAtual">
          <v-scale-transition mode="out-in">
            <div class="logo-section" v-show="mostrarLogo">
              <v-icon size="48" color="white">mdi-spa</v-icon>
              <h1 class="brand-name">Estética Pro</h1>
            </div>
          </v-scale-transition>
          <v-slide-y-transition mode="out-in">
            <p class="brand-tagline" v-show="mostrarTagline">{{ fraseAtual }}</p>
          </v-slide-y-transition>
        </div>
      </v-fade-transition>
    </div>

    <!-- Right Side - Login Form -->
    <div class="right-side">
      <v-scale-transition mode="out-in">
        <div class="login-form-container" v-show="mostrarFormulario">
          <form @submit.prevent="login" class="login-form">
            <v-slide-x-transition mode="out-in">
              <div class="form-header" v-show="mostrarHeader">
                <h2 class="form-title">Bem-vindo de volta</h2>
                <p class="form-subtitle">Entre com suas credenciais para acessar</p>
              </div>
            </v-slide-x-transition>

            <div class="form-fields">
              <v-slide-x-transition mode="out-in" hide-on-leave>
                <div class="field-group" v-show="mostrarCampos">
                  <label class="field-label">Email</label>
                  <v-text-field
                    v-model="email"
                    name="email"
                    placeholder="seu@email.com"
                    density="comfortable"
                    variant="outlined"
                    color="laranja"
                    clearable
                    :error="emailErro"
                    :error-messages="emailMensagemErro"
                    @blur="validarEmail"
                    @input="limparErroEmail"
                  />
                </div>
              </v-slide-x-transition>

              <v-slide-x-transition mode="out-in" hide-on-leave>
                <div class="field-group" v-show="mostrarCampos">
                  <label class="field-label">Senha</label>
                  <v-text-field
                    name="senha"
                    v-model="senha"
                    placeholder="Digite sua senha"
                    density="comfortable"
                    variant="outlined"
                    color="laranja"
                    :type="senhaEstaEscondida ? 'password' : 'text'"
                    clearable
                    :error="senhaErro"
                    :error-messages="senhaMensagemErro"
                    @blur="validarSenha"
                    @input="limparErroSenha"
                  >
                    <template #append-inner>
                      <v-icon
                        size="20"
                        :icon="senhaEstaEscondida ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="senhaEstaEscondida = !senhaEstaEscondida"
                        style="cursor: pointer;"
                      />
                    </template>
                  </v-text-field>
                </div>
              </v-slide-x-transition>

              <v-slide-x-transition mode="out-in" hide-on-leave>
                <v-btn
                  v-show="mostrarCampos"
                  block
                  type="submit"
                  color="laranjaAccentDarken"
                  size="large"
                  class="login-btn"
                  :loading="estadoDoAcesso === 'carregando'"
                >
                  <v-scroll-y-reverse-transition mode="out-in">
                    <template v-if="estadoDoAcesso === 'falhou'">
                      <span>Falhou - Tente novamente</span>
                    </template>
                    <template v-else-if="estadoDoAcesso === 'sucesso'">
                      <span>Sucesso!</span>
                    </template>
                    <template v-else-if="estadoDoAcesso === 'novamente'">
                      <span>Tente novamente</span>
                    </template>
                    <template v-else>
                      <span>Entrar</span>
                    </template>
                  </v-scroll-y-reverse-transition>
                </v-btn>
              </v-slide-x-transition>
            </div>

            <v-slide-x-transition mode="out-in" hide-on-leave>
              <div class="form-footer" v-show="mostrarFooter">
                <a href="#" class="forgot-password">Esqueceu sua senha?</a>
                <div class="signup-link">
                  Não tem uma conta? <strong class="contact-link">Entre em contato</strong>
                </div>
              </div>
            </v-slide-x-transition>
          </form>
        </div>
      </v-scale-transition>
    </div>
  </div>
</template>

<script>
// import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
import { useLoadingStore } from '@/modulos/Shared/Domain/Stores/loading'
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore'
import { sleep } from '@/modulos/Shared/Domain/Helpers/sleep'
import router from '@/router'
// import { useCoresDoTema } from '@/modulos/Shared/Domain/Composables/useCoresDoTema'
// import { gsap } from 'gsap'
// import pt from './traducao/pt.json';
// import en from './traducao/en.json';

export default {
   name: 'LoginScreen',
   data() {
      return {
        estadoDoAcesso: null,
        isSubscriber: null,
        email: '',
        senha: '',
        senhaEstaEscondida: true,
        nomeDoUsuarioLogado: null,
        fraseAtual: '',
        mostrarLogo: false,
        mostrarTagline: false,
        mostrarFormulario: false,
        mostrarHeader: false,
        mostrarCampos: false,
        mostrarFooter: false,
        emailErro: false,
        emailMensagemErro: '',
        senhaErro: false,
        senhaMensagemErro: '',
        frasesMotivacionais: [
          'Beleza que transforma vidas',
          'Cuidado que você merece',
          'Seu bem-estar é nossa prioridade',
          'Realce sua beleza natural',
          'Tecnologia e cuidado em harmonia',
          'Resultados que você pode ver',
          'Transforme sua autoestima',
          'Beleza começa com autocuidado',
          'Expertise em estética avançada',
          'Seu momento de relaxamento',
          'Tratamentos que fazem diferença',
          'Cuide de si com excelência',
          'Inovação em cada procedimento',
          'Pele radiante, autoestima elevada',
          'Sua beleza, nossa especialidade',
          'Procedimentos seguros e eficazes',
          'Renove sua energia interior',
          'Qualidade em cada detalhe',
          'Realce sua melhor versão',
          'Protocolos personalizados',
          'Sinta-se incrível todos os dias',
          'Estética com ciência e arte',
          'Revitalize corpo e mente',
          'Confiança através da beleza',
          'Seu bem-estar merece o melhor',
          'Transformação com segurança',
          'Beleza que reflete saúde',
          'Cuidado profissional e acolhedor',
          'Resultados naturais e harmoniosos',
          'Invista em você mesma'
        ]
      }
   },
  //  created() {
  //     // injeta as traduções só desse componente
  //     i18n.global.mergeLocaleMessage('pt', pt)
  //     i18n.global.mergeLocaleMessage('en', en)
  //   },
   mounted() {
     this.iniciarAnimacoes()
     this.sortearFrase()
   },
   methods: {
    validarEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.emailErro = true
        this.emailMensagemErro = 'Email é obrigatório'
        return false
      } else if (!emailRegex.test(this.email)) {
        this.emailErro = true
        this.emailMensagemErro = 'Email inválido'
        return false
      }
      this.emailErro = false
      this.emailMensagemErro = ''
      return true
    },
    validarSenha() {
      if (!this.senha) {
        this.senhaErro = true
        this.senhaMensagemErro = 'Senha é obrigatória'
        return false
      }
      this.senhaErro = false
      this.senhaMensagemErro = ''
      return true
    },
    limparErroEmail() {
      if (this.emailErro) {
        this.emailErro = false
        this.emailMensagemErro = ''
      }
    },
    limparErroSenha() {
      if (this.senhaErro) {
        this.senhaErro = false
        this.senhaMensagemErro = ''
      }
    },
    validarFormulario() {
      const emailValido = this.validarEmail()
      const senhaValida = this.validarSenha()
      return emailValido && senhaValida
    },
    sortearFrase() {
      const indiceAleatorio = Math.floor(Math.random() * this.frasesMotivacionais.length)
      this.fraseAtual = this.frasesMotivacionais[indiceAleatorio]
    },
    async iniciarAnimacoes() {
      await sleep(100)
      this.mostrarLogo = true
      await sleep(300)
      this.mostrarTagline = true
      await sleep(200)
      this.mostrarFormulario = true
      await sleep(200)
      this.mostrarHeader = true
      await sleep(150)
      this.mostrarCampos = true
      await sleep(200)
      this.mostrarFooter = true
    },
    async login() {
      const alertStore = useAlertStore()

      // Validar formulário antes de enviar
      if (!this.validarFormulario()) {
        alertStore.addAlert('Por favor, preencha todos os campos corretamente', 'error', 3000)
        return
      }

      // const auth = useAuthStore()
      const loading = useLoadingStore()
      this.estadoDoAcesso = 'carregando'

      try {
        // const resposta = await auth.login({ email: this.email, password: this.senha });
        // this.nomeDoUsuarioLogado = resposta.data.data.user_data.nome
        this.nomeDoUsuarioLogado = 'Raiany'

        this.estadoDoAcesso = 'sucesso'
        await sleep(700)
        loading.show('Redirecionando...')
        await sleep(1000)
        router.push('/atendimento')

      } catch (error) {
        this.estadoDoAcesso = 'falhou'
        alertStore.addAlert(error.response?.data?.message || error.message, 'error', 3000)
        await sleep(1200);
        this.estadoDoAcesso = 'novamente'
        await sleep(1200)
        this.estadoDoAcesso = null
      } finally {
        loading.hide();
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Left Side - Branding */
.left-side {
  flex: 1;
  background: linear-gradient(135deg, #EAA83B 0%, #EB6C3B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  position: relative;
  overflow: hidden;
}

.left-side::before {
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

.left-side::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.brand-content {
  text-align: center;
  z-index: 1;
  max-width: 500px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-family: 'Nunito', sans-serif;
  font-size: 1.25rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
}

/* Right Side - Login Form */
.right-side {
  flex: 1;
  background: var(--c-bg, #F4EEE6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.right-side::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle 180px at 12% 18%, rgba(235, 108, 59, 0.12) 0%, rgba(235, 108, 59, 0.06) 40%, transparent 70%),
    radial-gradient(circle 150px at 85% 12%, rgba(234, 168, 59, 0.10) 0%, rgba(234, 168, 59, 0.04) 40%, transparent 65%),
    radial-gradient(circle 200px at 8% 82%, rgba(240, 192, 106, 0.13) 0%, rgba(240, 192, 106, 0.05) 45%, transparent 70%),
    radial-gradient(circle 130px at 88% 88%, rgba(235, 153, 59, 0.09) 0%, rgba(235, 153, 59, 0.03) 40%, transparent 60%),
    radial-gradient(circle 100px at 50% 50%, rgba(234, 168, 59, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.right-side::after {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(235, 108, 59, 0.08) 0%, rgba(235, 108, 59, 0.04) 50%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -20px); }
}

.login-form-container {
  width: 100%;
  max-width: 450px;
  background: var(--c-surface, #FCF9F5);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: var(--shadow-lg, 0 12px 36px rgba(89,66,45,0.12));
  border: 1px solid var(--c-border, #EBE2D5);
  position: relative;
  z-index: 1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 1rem;
}

.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: var(--c-text, #3B342E);
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.95rem;
  color: #7f8c8d;
  margin: 0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-group :deep(.v-field) {
  border-radius: 12px;
}

.field-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text, #3B342E);
}

.login-btn {
  margin-top: 0.5rem;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 12px;
  background: #D66236 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(214, 98, 54, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 16px rgba(214, 98, 54, 0.4);
  transform: translateY(-1px);
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
  border-radius: 2px;
}

.forgot-password {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  color: #EAA83B;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #EB6C3B;
}

.signup-link {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: center;
}

.contact-link {
  color: #EAA83B;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #EB6C3B;
}

/* Responsive */
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }

  .left-side {
    min-height: 40vh;
    padding: 2rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .brand-tagline {
    font-size: 1rem;
  }

  .right-side {
    min-height: 60vh;
  }
}
</style>
