import { useAuthStore } from '@/modulos/Shared/Domain/Stores/auth'
import { useLoadingStore } from '@/modulos/Shared/Domain/Stores/loading'
import ApiService from '@/modulos/Shared/Domain/Services/ApiService'

// Cache para telas visíveis (evita múltiplas requisições por sessão)
let telasVisiveisCache = null

// Mapear nomes das telas para rotas
const telasParaRotas = {
  'analise_geral': 'analise-geral',
  'analise_por_uf': 'analise-por-uf',
  'comparativo_empresas': 'comparativo-empresas'
}

/**
 * Função para buscar telas visíveis do usuário
 * Utiliza cache para evitar múltiplas requisições na mesma sessão
 * @returns {Promise<Array>} Lista de telas visíveis
 */
export async function buscaTelasVisiveis() {
  // Se já temos cache, retorna sem fazer nova requisição
  if (telasVisiveisCache !== null) {
    return telasVisiveisCache
  }

  try {
    // const endpoint = `${endpoints.acesso.telasPermissoes}`

    // const resposta = await ApiService({
    //   method: 'get',
    //   url: endpoint,
    // })

    // Armazena no cache para próximas navegações
    // telasVisiveisCache = resposta.data.data
    return telasVisiveisCache
  } catch (error) {
    console.error('Erro ao buscar telas visíveis:', error)
    return []
  }
}

/**
 * Função para limpar cache de telas visíveis
 * Útil quando usuário faz logout
 */
export function limparCacheTelasVisiveis() {
  telasVisiveisCache = null
}

/**
 * Verifica se o estado de autenticação está hidratado
 * Aguarda até que o estado seja restaurado (máx: 100ms com tentativas)
 * @returns {Promise<boolean>} True se hidratado, false caso contrário
 */
export async function verificarHidracaoAuth() {
  const auth = useAuthStore()

  // Aguarda até que o estado seja restaurado (máx: 10 tentativas de 10ms)
  for (let i = 0; i < 10; i++) {
    if (auth.isHydrated) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 2))
  }

  return false // cancela navegação se não hidratou
}

/**
 * Verifica autenticação básica
 * Se requer auth e não está logado, redireciona para login
 * @param {Object} to - Rota de destino
 * @returns {Object|null} Redirecionamento ou null
 */
export function verificarAutenticacao(to) {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // Limpa cache quando usuário não está logado
    limparCacheTelasVisiveis()
    auth.returnUrl = to.fullPath
    return { name: 'login' }
  }
  return null
}

/**
 * Verifica permissões e determina redirecionamento
 * Busca telas visíveis e verifica acesso à rota
 * @param {Object} to - Rota de destino
 * @returns {Promise<Object|null>} Redirecionamento ou null
 */
export async function verificarPermissoes(to) {
  const auth = useAuthStore()
  const loading = useLoadingStore()

  if (!to.meta.requiresAuth || !auth.isLoggedIn) {
    return null
  }

  // Se a rota tem skipPermissionsCheck, não verifica permissões
  if (to.meta.skipPermissionsCheck) {
    return null
  }

  loading.show('Carregando permissões...')
  let telasVisiveis
  try {
    telasVisiveis = await buscaTelasVisiveis()
  } catch (error) {
    console.error('Erro ao buscar telas visíveis:', error)
    telasVisiveis = []
  } finally {
    loading.hide()
  }

  const rotaAtual = to.name

  // Se está tentando acessar 'sem-permissao' e tem telas visíveis, redirecionar para primeira tela disponível
  if (rotaAtual === 'sem-permissao' && telasVisiveis.length > 0) {
    const primeiraTelaDisponivel = telasVisiveis[0]
    if (primeiraTelaDisponivel && telasParaRotas[primeiraTelaDisponivel]) {
      return { name: telasParaRotas[primeiraTelaDisponivel] }
    }
  }

  // Se está acessando root (/) ou uma rota sem permissão, redireciona para primeira tela disponível
  if (to.path === '/home' || to.path === '') {
    if (telasVisiveis.length > 0) {
      const primeiraTelaDisponivel = telasVisiveis[0]
      if (primeiraTelaDisponivel && telasParaRotas[primeiraTelaDisponivel]) {
        return { name: telasParaRotas[primeiraTelaDisponivel] }
      }
    }
    return { name: 'sem-permissao' }
  }

  // Se está tentando acessar uma rota protegida, verificar permissão
  if (rotaAtual && Object.values(telasParaRotas).includes(rotaAtual)) {
    const telaCorrespondente = Object.keys(telasParaRotas).find(
      tela => telasParaRotas[tela] === rotaAtual
    )

    if (telaCorrespondente && !telasVisiveis.includes(telaCorrespondente)) {
      // Redireciona para primeira tela disponível ou página sem permissão
      const primeiraTelaDisponivel = telasVisiveis[0]
      if (primeiraTelaDisponivel && telasParaRotas[primeiraTelaDisponivel]) {
        return { name: telasParaRotas[primeiraTelaDisponivel] }
      }
      return { name: 'sem-permissao' }
    }
  }

  return null
}
