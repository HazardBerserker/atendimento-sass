import router from '@/router'
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore';
import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth';
import { sleep } from '@/modulos/Shared/Domain/Helpers/sleep';
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;


/**
 * Instância do Axios para chamadas à API.
 *
 * @constant
 * @type {import("axios").AxiosInstance}
 *
 * @property {string} baseURL - URL base da API, definida na variável de ambiente `VITE_API_BASE_URL`.
 * @property {boolean} withCredentials - Indica se cookies devem ser enviados em requisições cross-origin.
 * @property {Object} headers - Cabeçalhos HTTP enviados em todas as requisições.
 * @property {string} headers['Content-Type'] - Tipo de conteúdo enviado ao servidor (JSON).
 * @property {string} headers.Accept - Tipo de resposta esperada do servidor (JSON).
 */
const ApiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Lida com o fluxo quando o usuário não está autenticado.
 *
 * - Reseta o usuário no `authStore` para `null`.
 * - Redireciona o usuário para a rota de login.
 * - Aguarda 500ms para garantir que o redirecionamento conclua.
 * - Exibe um alerta avisando que o login é necessário.
 *
 * @async
 * @function usuarioNaoAutenticado
 * @returns {Promise<void>} - Não retorna nada, apenas executa efeitos colaterais.
 */
async function usuarioNaoAutenticado() {
  const authStore = useAuthStore()
  authStore.user = null
  router.push({ name: 'login' })
  await sleep(500);
  useAlertStore().addAlert('Não autenticado. Faça login novamente', 'warning', 4000)
}

ApiService.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          usuarioNaoAutenticado();
          break;
        case 419:
          usuarioNaoAutenticado();
          break;
      }
    }
    // Importantíssimo: Sempre propagar o erro para o catch dos componentes
    return Promise.reject(error);
  }
);


export default ApiService
