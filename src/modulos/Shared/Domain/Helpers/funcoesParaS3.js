import ApiService from "@/modulos/Shared/Domain/Services/ApiService";
import { useAlertStore } from "@/modulos/Shared/Domain/Stores/alertStore";
import { endpoints } from "@/utils/apiEndpoints";

export function urlEDaS3(url) {
  if (!url || typeof url !== 'string') return false;

  const urlEhHttpLocal = url.startsWith('http://');
  return !urlEhHttpLocal;
}

export async function geraUrlTemporariaParaImagemS3(urlDaImagem) {

  let queryParams = new URLSearchParams();
  queryParams.append('path', urlDaImagem);
  const query = `?${queryParams.toString()}`

  const alertStore = useAlertStore()

  const endpoint = endpoints.freteCotacao.geraUrlTemporariaParaImagemS3;
  try {
    const resposta =  await ApiService({
      method: 'get',
      url: `${endpoint}${query}`,
    })

    return  resposta?.data?.data?.original?.url

  } catch (error) {
    console.log(error)
    alertStore.addAlert('Erro ao gerar URL temporária para imagem', 'error')
  }
}


