import { createRouter, createWebHistory } from 'vue-router'
import { limparCacheTelasVisiveis } from '@/modulos/Shared/Domain/Services/RouteGuardService'
import AuthLayout from '@/modulos/Layout/AuthLayout.vue'
import NotFound from '@/modulos/Shared/Components/NotFound/NotFound.vue'
import AtendimentoView from '@/modulos/Atendimento/View/Root/AtendimentoView.vue'
import LoginView from '@/modulos/Login/View/Root/LoginView.vue'
// import SemPermissao from '@/components/SemPermissao/SemPermissao.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    component: AuthLayout,
    // meta: { requiresAuth: true },
    meta: { requiresAuth: false },
    redirect: '/atendimento',
    children: [
      {
        path: '/atendimento',
        name: 'atendimento',
        component: AtendimentoView,
      },
      {
        path: '/clientes',
        name: 'clientes',
        component: () => import('@/modulos/Cliente/View/Root/ClientesView.vue'),
      },
      {
        path: '/configuracoes',
        name: 'configuracoes',
        component: () => import('@/modulos/Configuracoes/View/Root/ConfiguracoesView.vue'),
      },
    ]
  },
  // {
  //   path: '/sem-permissao',
  //   name: 'sem-permissao',
  //   component: SemPermissao,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to) => {
  // Primeiro, verificar hidratação do auth
  // const hidratado = await verificarHidracaoAuth()
  // if (!hidratado) {
  //   return false
  // }

  // Segundo, verificar autenticação básica
  // const authRedirect = verificarAutenticacao(to)
  // if (authRedirect) {
  //   return authRedirect
  // }

  // Terceiro, verificar permissões se necessário
  // const permRedirect = await verificarPermissoes(to)
  // if (permRedirect) {
  //   return permRedirect
  // }

  // Se passou todas as verificações, permite navegação
  return null
})

export default router
export { limparCacheTelasVisiveis }
