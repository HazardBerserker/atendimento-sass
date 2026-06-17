import ApiService from '@/modulos/Shared/Domain/Services/ApiService';
import { endpoints } from '@/utils/apiEndpoints';
import { useAlertStore } from '@/modulos/Shared/Domain/Stores/alertStore';
/**
 * Busca códigos da empresa pelo código.
 *
 * @param {string} codEmpresa - Valor digitado no campo (ex: 2333)
 * @param {Function} onSuccess - Callback que recebe a lista de PNs retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaCodEmpresa(codEmpresa, onSuccess, setLoading = null) {
  if (!codEmpresa) {
    return;
  }
  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaCodEmpresa;
    const url = `${endpoint}/${codEmpresa}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar códigos da empresa', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
/**
 * Busca Família de peças pelo nome.
 *
 * @param {string} familiaPeca - Valor digitado no campo (ex: Chave de Seta)
 * @param {Function} onSuccess - Callback que recebe a lista de famílias de peças retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaFamiliaPeca(codEmpresa, onSuccess, setLoading = null) {
  if (!codEmpresa) {
    return;
  }
  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaFamiliaPeca;
    const url = `${endpoint}/${codEmpresa}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar família de peças', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
/**
 * Busca Modelos de Veículo pelo nome.
 *
 * @param {string} modelo - Valor digitado no campo (ex: Sandero)
 * @param {Function} onSuccess - Callback que recebe a lista de famílias de modelos retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaModeloVeiculo(modelo, onSuccess, setLoading = null) {
  if (!modelo) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaModeloVeiculo;
    const url = `${endpoint}/${modelo}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar modelos de veículo', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Modelos Detalhados de Veículo pelo nome.
 *
 * @param {string} modeloDetalhado - Valor digitado no campo (ex: Sandero Stepway)
 * @param {Function} onSuccess - Callback que recebe a lista de modelos detalhados retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaModeloDetalhado(modeloDetalhado, onSuccess, setLoading = null) {
  if (!modeloDetalhado) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaModeloDetalhado;
    const url = `${endpoint}/${modeloDetalhado}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar modelos detalhados', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Anos de Fabricação do Veículo pelo ano.
 *
 * @param {string} anoVeiculo - Valor digitado no campo (ex: 2023)
 * @param {Function} onSuccess - Callback que recebe a lista de anos de veiculo retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaAnoVeiculo(anoVeiculo, onSuccess, setLoading = null) {
  if (!anoVeiculo) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaAnoVeiculo;
    const url = `${endpoint}/${anoVeiculo}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar anos de veículo', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Tipos de Veículo pelo nome.
 *
 * @param {string} tipoVeiculo - Valor digitado no campo (ex: moto)
 * @param {Function} onSuccess - Callback que recebe a lista de anos de veiculo retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaTipoVeiculo(tipoVeiculo, onSuccess, setLoading = null) {
  if (!tipoVeiculo) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaTipoVeiculo;
    const url = `${endpoint}/${tipoVeiculo}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar tipos de veículo', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Modelos Detalhados de Veículo pelo nome.
 *
 * @param {string} marca - Valor digitado no campo (ex: Sandero)
 * @param {Function} onSuccess - Callback que recebe a lista de marcas de marcas retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaMarcaVeiculo(marca, onSuccess, setLoading = null) {
  if (!marca) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaMarcaVeiculo;
    const url = `${endpoint}/${marca}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar marcas de veículo', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Motores do Veículo pelo motor.
 *
 * @param {string} motor - Valor digitado no campo (ex: VB1)
 * @param {Function} onSuccess - Callback que recebe a lista de motores retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaMotor(motor, onSuccess, setLoading = null) {
  if (!motor) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaMotor;
    const url = `${endpoint}/${motor}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar motores', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Descrições do Catalogo pela descrição.
 *
 * @param {string} descricao - Valor digitado no campo (ex: Com limpador dianteiro)
 * @param {Function} onSuccess - Callback que recebe a lista de descricoes retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaDescricao(descricao, onSuccess, setLoading = null) {
  if (!descricao) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.dashboard.autocompletaDescricao;
    const url = `${endpoint}/${descricao}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar descrições', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Busca Municípios por nome.
 *
 * @param {string} nomeMunicipio - Valor digitado no campo (ex: São Paulo)
 * @param {Function} onSuccess - Callback que recebe a lista de municipios retornada
 * @param {Function} [setLoading] - (Opcional) Função que controla o estado de loading
 */
export async function autocompletaMunicipio(nomeMunicipio, onSuccess, setLoading = null) {
  if (!nomeMunicipio) {
    return;
  }

  const alertStore = useAlertStore();
  try {
    if (setLoading) setLoading(true);
    const endpoint = endpoints.municipio.listaMunicipiosPorNome;
    const url = `${endpoint}/${nomeMunicipio}`;
    const resposta = await ApiService({
      method: 'get',
      url: url,
    });
    const lista = resposta.data?.data ?? [];
    onSuccess(lista);
  } catch (error) {
    console.log(error);
    alertStore.addAlert('Não foi possível buscar municípios', 'error', 3000);
  } finally {
    if (setLoading) setLoading(false);
  }
}
