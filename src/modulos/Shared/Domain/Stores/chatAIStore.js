// src/stores/chatStore.js
import { defineStore } from "pinia";
import ApiService from "@/modulos/Shared/Domain/Services/ApiService";
import { endpoints } from "@/utils/apiEndpoints";
import { nextTick } from "vue";
import { useAlertStore } from "./alertStore";
import { useLoadingStore } from "./loading";

export const useChatStore = defineStore("chat", {
  state: () => ({
    numeroConversaAtual: null,
    conversas: [],
    estaAguardandoResposta: {}, // objeto em vez de array
    scrollAteOFimDoChat: false,
    estaVisivel: null,
    mensagensNaoLidas: {},
    aguardandoConversaSeremCarregadas: true
  }),
  persist: true,

  actions: {
    async buscaConversasEMensagensDoUsuarioAutenticado() {
      try {


        const endpoint = `${endpoints.openAI.buscaConversasEMensagensDoUsuarioAutenticado}`;

        const resposta = await ApiService({
          method: 'GET',
          url: endpoint,
        });

        const conversas = resposta?.data?.data;

        this.preencheVariaveisDeCarregamento(conversas);

        this.conversas = conversas;

      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.addAlert(error, 'error', 3000);
        return;
      } finally {
        this.aguardandoConversaSeremCarregadas = false;
      }
    },

    async enviaMensagem(dadosMensagem) {
      // Aceita tanto string quanto objeto { prompt, id_empresa }
      let promptTexto, idEmpresa;

      if (typeof dadosMensagem === 'string') {
        // Compatibilidade com uso anterior
        promptTexto = dadosMensagem;
        idEmpresa = null;
      } else if (dadosMensagem && typeof dadosMensagem === 'object') {
        // Novo formato com contexto de empresa
        promptTexto = dadosMensagem.prompt;
        idEmpresa = dadosMensagem.id_empresa;
      } else {
        console.error('❌ Formato de dados inválido:', dadosMensagem);
        return;
      }

      if (!promptTexto || !promptTexto.trim()) return;

      const conversa = this.conversas.find(c => c.numero_conversa == this.numeroConversaAtual);
      if (!conversa) return;

      const numeroConversaAtualSemAlteracao = conversa.numero_conversa

      const novaMensagem = {
        texto: promptTexto.trim(),
        enviada: true
      };

      conversa.mensagens.unshift(novaMensagem);

      this.estaAguardandoResposta[this.numeroConversaAtual] = true;

      try {
        const payload = {
          prompt: promptTexto,
          numero_conversa: this.numeroConversaAtual
        };

        // Adiciona o id_empresa se foi selecionado
        if (idEmpresa !== null && idEmpresa !== undefined) {
          payload.id_empresa = idEmpresa;
        }

        ApiService.post(endpoints.openAI.processarPrompt, payload);
      } catch {
        // se der algum erro será de autorização, então a mensagem nao foi enviada pro backend corretamente
        // por isso devemos remove-la do store aqui
        this.estaAguardandoResposta[numeroConversaAtualSemAlteracao] = false;
        conversa.mensagens = conversa.mensagens.filter(m => m !== novaMensagem);
      }
    },

    // método acionado pelo WEBSOCKETS
    adicionarMensagemIA(textoResposta, numeroConversa) {
      const conversa = this.conversas.find(c => c.numero_conversa === numeroConversa);
      if (!conversa) return;

      conversa.mensagens.unshift({
        texto: textoResposta,
        enviada: false,
      });
      this.estaAguardandoResposta[numeroConversa] = false;

      if(!this.estaVisivel || this.numeroConversaAtual != numeroConversa) {
        if(!this.mensagensNaoLidas[numeroConversa]) {
          this.mensagensNaoLidas[numeroConversa] = 0;
        }

        this.mensagensNaoLidas[numeroConversa] += 1;
      }
    },

    dispararScroll() {
      this.scrollAteOFimDoChat = true;

      nextTick(() => {
        this.scrollAteOFimDoChat = false;
      });
    },

    async criaConversa() {
      if(this.conversas.length == 10) {
        const alertStore = useAlertStore();
        alertStore.addAlert("Você não pode ter mais do que 10 conversas, apague para criar mais", "warning", 3000);
        return;
      }

      const loadingStore = useLoadingStore();

      loadingStore.show('Criando conversa...');

      try {
        const endpoint = `${endpoints.openAI.novaConversa}`;

        const resposta = await ApiService({
          method: 'post',
          url: endpoint,
        });

        const conversa = resposta?.data?.data;

        const novaConversa = {
          numero_conversa: conversa.numero_conversa,
          mensagens: [],
          titulo: conversa.titulo
        };

        this.conversas.unshift(novaConversa);
        this.numeroConversaAtual = novaConversa.numero_conversa;
        this.estaAguardandoResposta[novaConversa.numero_conversa] = false;

      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.addAlert(error, 'error', 3000);
        return;
      } finally {
        loadingStore.hide();
      }


    },

    async apagaConversa() {
      if(!this.numeroConversaAtual) {
        return;
      }

      const alertStore = useAlertStore();
      const loadingStore = useLoadingStore();

      if(this.estaAguardandoResposta[this.numeroConversaAtual]) {
        alertStore.addAlert('Você não pode apagar uma conversa que está aguardando uma resposta', 'warning', 3000);
        return
      }

      loadingStore.show('Apagando conversa...');

      try {
        const resposta = await ApiService({
          method: 'delete',
          url: endpoints.openAI.apagaConversa,
          data: {
            numero_conversa: this.numeroConversaAtual
          }
        });
        alertStore.addAlert(resposta.data?.data?.message, 'success', 2000);
      } catch (error) {
        alertStore.addAlert(error?.response?.data?.message || 'Erro ao apagar conversa', 'error', 2000);
        return
      }

      const conversa = this.conversas.find(c => c.numero_conversa == this.numeroConversaAtual);
      const numeroDeMensagensDaConversa = conversa.mensagens.length;
      this.conversas = this.conversas.filter(c => c.numero_conversa != this.numeroConversaAtual);

      loadingStore.hide();
      // se nao houver mensagens na conversa subentende-se que ela acabou de ser criada entao nao esta no backend
      // logo devemos apagar só localmente sem requisicoes
      if(numeroDeMensagensDaConversa == 0) {
        this.vaiParaProximaConversaSeHouver()
        return;
      }

      // se ainda houver conversas, define a primeira como atual
      this.vaiParaProximaConversaSeHouver()
    },

    vaiParaProximaConversaSeHouver() {
      if(this.conversas.length) {
        this.numeroConversaAtual = this.conversas[0].numero_conversa;
        return
      }

      this.numeroConversaAtual = null;
    },

    preencheVariaveisDeCarregamento(conversas) {
      if(!conversas) {
        return
      }

      for (const index in conversas) {

        // atribuindo primeira conversa atual como padrao caso não exista
        if(!this.numeroConversaAtual) {
          this.numeroConversaAtual = conversas[index].numero_conversa;
        }

        const ultimaMensagem = conversas[index].mensagens[0];

        // se a última mensagem for do usuário, está aguardando resposta
        if (ultimaMensagem?.enviada) {
          this.estaAguardandoResposta[conversas[index].numero_conversa] = true;
          continue; // não para o loop, vai para a próxima conversa
        }

        this.estaAguardandoResposta[conversas[index].numero_conversa] = false;
      }
    },

    preencheVariaveisDeMensagensNaoLidas(conversas) {
      if(!conversas) {
        return
      }

      for (const index in conversas) {
        this.mensagensNaoLidas[conversas[index].numero_conversa] = 0;
      }
    },

    ocultaOuExibeChat() {
      this.estaVisivel = !this.estaVisivel;

      if(this.estaVisivel && this.mensagensNaoLidas[this.numeroConversaAtual]) {
        this.mensagensNaoLidas[this.numeroConversaAtual] = 0;
      }
    },

    calculaTotalDeMensagensNaoLidas() {
      return Object.values(this.mensagensNaoLidas).reduce((acc, curr) => acc + curr, 0);
    },

    alteraNumeroConversaAtual(idConversa) {
      this.mensagensNaoLidas[idConversa] = 0;
      this.numeroConversaAtual = idConversa;
    }
  }
});
