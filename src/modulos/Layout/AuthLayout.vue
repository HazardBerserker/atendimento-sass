<template>
  <v-app>
    <AppBarHeader
      :telasVisiveis="telasVisiveis ?? []"
      @onLogout="logout"
    />

    <v-main class="height-screen d-flex align-center justify-center">
        <v-container class="main h-100" fluid style="min-height: 93vh; background: #F8F8F7">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBarHeader from '@/modulos/Layout/AppBarHeader.vue';
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
// import ApiService from '@/modulos/Shared/Domain/Services/ApiService';
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore';
// import EditarPerfilUsuario from '@/components/Usuario/Embeeded/EditarPerfilUsuario.vue';

export default {
  components: {
    AppBarHeader,
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
  height: 93.25vh;
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
