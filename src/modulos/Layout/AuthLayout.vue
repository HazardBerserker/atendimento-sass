<template>
  <v-app>
    <AppBarHeader
      :telasVisiveis="telasVisiveis ?? []"
      @onLogout="logout"
    />

    <v-main class="height-screen">
        <v-container class="main" fluid>
          <router-view v-slot="{ Component }">
            <Transition name="route" mode="out-in" appear>
              <component :is="Component" />
            </Transition>
          </router-view>
        </v-container>
    </v-main>

    <AppBottomNav />
  </v-app>
</template>

<script>
import AppBarHeader from '@/modulos/Layout/AppBarHeader.vue';
import AppBottomNav from '@/modulos/Layout/AppBottomNav.vue';
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
// import ApiService from '@/modulos/Shared/Domain/Services/ApiService';
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore';
// import EditarPerfilUsuario from '@/components/Usuario/Embeeded/EditarPerfilUsuario.vue';

export default {
  components: {
    AppBarHeader,
    AppBottomNav,
  },
  async mounted() {
    // await this.buscaTelasVisiveis()
  },
  data() {
    return {
      telasVisiveis: []
    }
  },
  methods: {
    async buscaTelasVisiveis() {
      try {
        // const endpoint = `${endpoints.acesso.telasPermissoes}`;

        // const resposta =  await ApiService({
        //   method: 'get',
        //   url: endpoint,
        // })

        // nome das telas esta no Banco de Dados
        // this.telasVisiveis = resposta.data.data


      } catch (error) {
        console.log(error)
        const alertStore = useAlertStore()

        alertStore.addAlert('Não foi possível buscar dados de telas visíveis', 'error');
        return
      }
    },

    logout() {
      const auth = useAuthStore()
      auth.logout()
    }
  }
}
</script>

<style>
.main {
  min-height: calc(100vh - 60px);
  background: var(--c-bg);
  padding: 0;
}

/* Em modo app (tablet/celular) o conteúdo ganha respiro para a barra inferior */
@media (max-width: 1024px) {
  .main {
    padding-bottom: calc(92px + env(safe-area-inset-bottom));
  }
}

.diagonal-app-bar::before {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 30%;
  background-color: black;

  /* cria o corte diagonal */
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
  z-index: 1;
}

.v-toolbar-title {
  position: relative;
  z-index: 2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.linhaPar {
    background-color: #FAFAFA;
}

.linhaImpar {
    background-color: #EEEEEE;
}

.hoverable-row tbody tr:hover td{
  background-color: #ffffff !important; /* Cor de fundo ao passar o mouse */
  transition: background-color 30ms linear !important;
}

</style>
