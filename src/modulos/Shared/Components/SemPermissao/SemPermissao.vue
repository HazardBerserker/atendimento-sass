<template>
  <div class="bg-kostalDarken4 d-flex align-center justify-center min-height-screen" :style="estilosCard">

    <v-container class="text-center">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <div class="pa-8">
            <div class="d-flex flex-column align-center ga-6">
              <!-- Ícone principal -->
              <v-card
                class="d-flex align-center justify-center pa-6"
                variant="flat"
                color="kostalDarken1"
                rounded="xl"
                width="120"
                height="120"
              >
                <v-icon size="60" color="kostalAccent">mdi-shield-lock</v-icon>
              </v-card>

              <!-- Título e descrição -->
              <div class="d-flex flex-column align-center ga-3">
                <h1 class="text-h4 font-weight-bold text-kostalAccent">
                  {{ $t('semPermissaoTitulo') }}
                </h1>
                <p class="text-h6 text-kostalLighten1 text-center">
                  {{ $t('semPermissaoDescricao') }}
                </p>
              </div>

              <!-- Informações adicionais -->
              <v-card
                variant="outlined"
                color="kostalLighten2"
                rounded="lg"
                class="pa-4 w-100"
                :style="{ background: 'var(--bg-gradient)' }"
              >
                <div class="d-flex align-center ga-3">
                  <v-icon color="kostalLighten2">mdi-information</v-icon>
                  <div class="text-body-1 text-kostalLighten2">
                    {{ $t('semPermissaoInformacao') }}
                  </div>
                </div>
              </v-card>

              <!-- Ações -->
              <div class="d-flex flex-column align-center ga-3">
                <v-btn
                  variant="flat"
                  color="kostalAccent"
                  size="large"
                  prepend-icon="mdi-reload"
                  @click="verificarPermissoesNovamente"
                  :loading="verificandoPermissoes"
                >
                  {{ $t('verificarNovamente') }}
                </v-btn>

                <v-btn
                  variant="text"
                  color="kostalLighten2"
                  @click="fazerLogout"
                  prepend-icon="mdi-logout"
                >
                  {{ $t('sair') }}
                </v-btn>
              </div>

              <!-- Informações do usuário -->
              <v-divider class="w-100"></v-divider>

              <div class="text-caption text-kostalLighten2 text-center">
                {{ $t('usuarioLogado') }}: {{ usuario?.nome || 'N/A' }}<br>
                {{ $t('empresa') }}: {{ usuario?.empresa?.nome || 'N/A' }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
import { useTemaStore } from '@/modulos/Shared/Domain/Stores/useTemaStore'
import { useLoadingStore } from '@/modulos/Shared/Domain/Stores/loading'
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore'
import { limparCacheTelasVisiveis } from '@/router/index.js'
import ApiService from '@/modulos/Shared/Domain/Services/ApiService'
import { endpoints } from '@/utils/apiEndpoints'
import pt from './traducao/pt.json'
import en from './traducao/en.json'
import { i18n } from '@/plugins/i18n'

export default {
  name: 'SemPermissao',
  created() {
    // injeta as traduções só desse componente
    i18n.global.mergeLocaleMessage('pt', pt)
    i18n.global.mergeLocaleMessage('en', en)
  },
  data() {
    return {
      verificandoPermissoes: false
    }
  },
  computed: {
    usuario() {
      return useAuthStore().user
    },
    temaAtual() {
      return useTemaStore().temaAtual
    },
    estilosCard() {
      if (this.temaAtual === 'light') {
        return {
          '--bg-gradient': 'linear-gradient(145deg, rgba(4, 146, 255, 0.233), rgba(0, 101, 179, 0.08))',
          '--bg-gradient-header': 'rgb(172, 203, 229)',
          '--border-color': 'rgba(0, 101, 179, 0.18)',
          '--hover-shadow': '0 8px 32px rgba(0, 101, 179, 0.18), 0 0 0 1px rgba(0, 101, 179, 0.12)',
          '--shimmer-bg': 'linear-gradient(90deg, transparent, rgba(0, 101, 179, 0.08), transparent)',
          '--label-color': 'rgba(0, 0, 0, 0.6)',
          '--value-color': 'rgba(0, 0, 0, 0.87)'
        };
      } else {
        return {
          '--bg-gradient': 'linear-gradient(145deg, rgba(0, 77, 136, 0.226), rgba(0, 101, 179, 0.02))',
          '--bg-gradient-header': 'rgb(16, 43, 67)',
          '--border-color': 'rgba(0, 101, 179, 0.274)',
          '--shimmer-bg': 'linear-gradient(90deg, transparent, rgba(0, 77, 136, 0.185), transparent)',
          '--hover-shadow': '0 8px 32px rgba(0, 101, 179, 0.12), 0 0 0 1px rgba(0, 101, 179, 0.08)',
          '--label-color': 'rgba(255, 255, 255, 0.7)',
          '--value-color': 'rgba(255, 255, 255, 0.95)'
        };
      }
    }
  },
  methods: {
    async verificarPermissoesNovamente() {
      const loading = useLoadingStore()
      const alertStore = useAlertStore()

      this.verificandoPermissoes = true

      try {
        loading.show(this.$t('verificandoPermissoes'))

        // Limpa o cache de permissões
        limparCacheTelasVisiveis()

        // Busca novamente as permissões
        const endpoint = `${endpoints.acesso.telasPermissoes}`;
        const resposta = await ApiService({
          method: 'get',
          url: endpoint,
        })

        const telasVisiveis = resposta.data.data

        if (telasVisiveis && telasVisiveis.length > 0) {
          // Se agora tem permissões, redireciona para primeira tela disponível
          const telasParaRotas = {
            'analise_geral': 'analise-geral',
            'analise_por_uf': 'analise-por-uf',
            'comparativo_de_empresas': 'comparativo-empresas'
          }

          const primeiraTelaDisponivel = telasVisiveis[0]
          const rotaDestino = telasParaRotas[primeiraTelaDisponivel]

          if (rotaDestino) {
            alertStore.addAlert(this.$t('permissoesAtualizadas'), 'success')
            this.$router.push({ name: rotaDestino })
            return
          }
        }

        alertStore.addAlert(this.$t('aindasemPermissoes'), 'info')

      } catch (error) {
        alertStore.addAlert(this.$t('erroVerificarPermissoes'), 'error')
        console.error('Erro ao verificar permissões:', error)
      } finally {
        loading.hide()
        this.verificandoPermissoes = false
      }
    },

    fazerLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
.min-height-screen {
  min-height: 100vh;
}
</style>
