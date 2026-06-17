import ApiService from '@/modulos/Shared/Domain/Services/ApiService';
import { endpoints } from '@/utils/apiEndpoints';
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore';

/**
 * Busca motoristas pelo nome do remetente.
 *
 * @param {string} nomeMotorista - Valor digitado no campo (ex: coleta_remetente)
 * @param {Function} onSuccess - Callback que recebe a lista de motoristas retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function buscaListaDeMotoristasHelper(nomeMotorista, onSuccess, setLoading = null) {
  if (!nomeMotorista) {
    return; // evita buscas com termos curtos
  }

  const alertStore = useAlertStore();

  try {
    if (setLoading) setLoading(true);

    const endpoint = endpoints.motorista.listaPorRazaoSocial;
    const url = `${endpoint}/${nomeMotorista}`;

    const resposta = await ApiService({
      method: 'get',
      url: url,
    });

    const lista = resposta.data?.data ?? [];

    onSuccess(lista);

  } catch (error) {
    console.log(error);
    alertStore.addAlert('Erro ao buscar motoristas', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
