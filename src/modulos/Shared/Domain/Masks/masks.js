/**
 * Utilitários para formatação e máscaras de dados
 *
 * Este arquivo contém funções auxiliares para formatação de:
 * - Números (BR, abreviações, moeda)
 * - Documentos (CPF, CNPJ)
 * - CEP e Telefone
 * - Datas (conversões entre formatos BR, ISO e Banco de Dados)
 */

import { Mask } from 'maska';
import dayjs from 'dayjs';
import { formatDate } from 'date-fns';

/**
 * Aplica uma máscara genérica a um valor usando a biblioteca Maska
 *
 * @param {string} valor - Valor a ser formatado (ex: "12345678900")
 * @param {string} padrao - Padrão da máscara (ex: "###.###.###-##")
 * @returns {string} Valor formatado com a máscara aplicada
 *
 * @example
 * aplicarMascara("12345678900", "###.###.###-##") // "123.456.789-00"
 */
function aplicarMascara(valor, padrao) {
  if (!valor) return '';
  const mask = new Mask({ mask: padrao });
  return mask.masked(valor);
}

/**
 * Formata um número para o padrão brasileiro com 2 casas decimais
 *
 * Utiliza a API Intl.NumberFormat para garantir formatação correta
 * com separador de milhar (.) e decimal (,) no padrão BR.
 *
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado no padrão BR (ex: "1.234,56")
 *
 * @example
 * formataNumeroBR(1234.56) // "1.234,56"
 * formataNumeroBR(1000000) // "1.000.000,00"
 */
export function formataNumeroBR(numero) {
  if (numero == null || isNaN(numero)) return '';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}

/**
 * Formata um número para o padrão brasileiro SEM casas decimais
 *
 * Útil para exibir números inteiros ou contadores com separador de milhar.
 *
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado no padrão BR sem decimais (ex: "1.234")
 *
 * @example
 * formataNumeroBRSemVirgula(1234.56) // "1.235" (arredonda)
 * formataNumeroBRSemVirgula(1000000) // "1.000.000"
 */
export function formataNumeroBRSemVirgula(numero) {
  if (numero == null || isNaN(numero)) return '';

  return new Intl.NumberFormat('pt-BR').format(numero)
}

/**
 * Abrevia números grandes usando notação compacta (K, M, B)
 *
 * Converte números grandes em formato legível com sufixos:
 * - K = mil (1.000)
 * - M = milhão (1.000.000)
 * - B = bilhão (1.000.000.000)
 *
 * @param {number} numero - Número a ser abreviado
 * @param {number} casasDecimais - Quantidade de casas decimais no resultado
 * @param {string} nacionalidade - Locale para formatação (padrão: 'pt-BR')
 * @returns {string} Número abreviado (ex: "1,5 mi" ou "2,3 mil")
 *
 * @example
 * abreviaNumero(1500, 2, 'pt-BR') // "1,50 mil"
 * abreviaNumero(1500000, 1, 'pt-BR') // "1,5 mi"
 * abreviaNumero(2300000000, 2, 'pt-BR') // "2,30 bi"
 */
export function abreviaNumero(numero, casasDecimais, nacionalidade = 'pt-BR') {
  if (numero == null || isNaN(numero)) return '';

  const formatador = new Intl.NumberFormat(nacionalidade, {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  });

  return formatador.format(numero);
}

/**
 * Formata um CNPJ no padrão brasileiro
 *
 * @param {string} cnpj - CNPJ sem formatação (ex: "12345678000190")
 * @returns {string} CNPJ formatado (ex: "12.345.678/0001-90")
 *
 * @example
 * formataCNPJ("12345678000190") // "12.345.678/0001-90"
 */
export function formataCNPJ(cnpj) {
  return aplicarMascara(cnpj, '##.###.###/####-##');
}

/**
 * Formata um CEP no padrão brasileiro
 *
 * @param {string} cep - CEP sem formatação (ex: "01310100")
 * @returns {string} CEP formatado (ex: "01310-100")
 *
 * @example
 * formataCEP("01310100") // "01310-100"
 */
export function formataCEP(cep) {
  return aplicarMascara(cep, '#####-###');
}

/**
 * Formata um CPF no padrão brasileiro
 *
 * @param {string} cpf - CPF sem formatação (ex: "12345678900")
 * @returns {string} CPF formatado (ex: "123.456.789-00")
 *
 * @example
 * formataCPF("12345678900") // "123.456.789-00"
 */
export function formataCPF(cpf) {
  return aplicarMascara(cpf, '###.###.###-##');
}

/**
 * Formata um telefone brasileiro (celular ou fixo)
 *
 * Detecta automaticamente se é celular (11 dígitos) ou fixo (10 dígitos)
 * e aplica a máscara correspondente.
 *
 * @param {string} telefone - Telefone sem formatação
 * @returns {string} Telefone formatado
 *
 * @example
 * formataTelefone("11987654321") // "(11) 98765-4321" (celular)
 * formataTelefone("1133334444") // "(11) 3333-4444" (fixo)
 */
export function formataTelefone(telefone) {
  if (!telefone) return '';
  const padrao = telefone.length === 11 ? '(##) #####-####' : '(##) ####-####';
  return aplicarMascara(telefone, padrao);
}

/**
 * Formata data do padrão do Banco de Dados (ISO) para o padrão brasileiro com hora
 *
 * Converte datas no formato ISO/BD (yyyy-mm-dd ou yyyy-mm-dd HH:mm:ss)
 * para o formato brasileiro DD/MM/YYYY HH:mm:ss.
 *
 * @param {string} data - Data no formato ISO (ex: "2025-10-20" ou "2025-10-20 14:30:00")
 * @returns {string} Data formatada no padrão BR com hora (ex: "20/10/2025 14:30:00")
 *
 * @example
 * formataData("2025-10-20") // "20/10/2025 00:00:00"
 * formataData("2025-10-20 14:30:00") // "20/10/2025 14:30:00"
 */
export function formataData(data) {
  return dayjs(data).format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Formata data do padrão do Banco de Dados (ISO) para o padrão brasileiro APENAS data
 *
 * Converte datas no formato ISO/BD para o formato brasileiro DD/MM/YYYY,
 * ignorando a parte da hora (se existir).
 *
 * @param {string} data - Data no formato ISO (ex: "2025-10-20")
 * @returns {string} Data formatada no padrão BR somente data (ex: "20/10/2025")
 *
 * @example
 * formataDataSomenteData("2025-10-20") // "20/10/2025"
 * formataDataSomenteData("2025-10-20 14:30:00") // "20/10/2025"
 */
export function formataDataSomenteData(data) {
  return dayjs(data).format('DD/MM/YYYY');
}

/**
 * Converte data do padrão brasileiro para o padrão do Banco de Dados (ISO)
 *
 * Transforma datas no formato DD/MM/YYYY para o formato yyyy-mm-dd
 * aceito pelo banco de dados.
 *
 * @param {string} dataBr - Data no formato brasileiro (ex: "20/10/2025")
 * @returns {string} Data no formato ISO/BD (ex: "2025-10-20")
 *
 * @example
 * formataDataBRParaPadraoBanco("20/10/2025") // "2025-10-20"
 * formataDataBRParaPadraoBanco("5/3/2025") // "2025-03-05"
 */
export function formataDataBRParaPadraoBanco(dataBr) {
  const [dia, mes, ano] = dataBr.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

/**
 * Formata data ISO/JavaScript Date para o padrão do Banco de Dados
 *
 * Converte objetos Date ou strings ISO para o formato yyyy-MM-dd
 * usando a biblioteca date-fns.
 *
 * @param {Date|string} data - Data no formato Date ou ISO
 * @returns {string} Data no formato ISO/BD (ex: "2025-10-20")
 *
 * @example
 * formataDataISOParaPadraoBanco(new Date()) // "2025-10-20"
 * formataDataISOParaPadraoBanco("2025-10-20T14:30:00") // "2025-10-20"
 */
export function formataDataISOParaPadraoBanco(data) {
  return formatDate(new Date(data), 'yyyy-MM-dd');
}

/**
 * Converte data do padrão brasileiro (string) para objeto Date JavaScript
 *
 * Transforma strings no formato "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm:ss"
 * em objetos Date válidos para manipulação no JavaScript.
 *
 * @param {string} dataBr - Data no formato brasileiro (ex: "20/10/2025" ou "20/10/2025 14:30:00")
 * @returns {Date|null} Objeto Date ou null se a data for inválida
 *
 * @example
 * formataDataBRParaDate("20/10/2025") // Date object: 2025-10-20T00:00:00
 * formataDataBRParaDate("20/10/2025 14:30:00") // Date object: 2025-10-20T14:30:00
 */
export function formataDataBRParaDate(dataBr) {
  if (!dataBr) return null;

  const [dataParte, horaParte = '00:00:00'] = dataBr.split(' ');
  const [dia, mes, ano] = dataParte.split('/');

  const isoString = `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${horaParte}`;
  return new Date(isoString);
}

/**
 * Formata um valor numérico como moeda brasileira (Real)
 *
 * Converte números em formato monetário com símbolo R$, separador de milhar
 * e 2 casas decimais no padrão brasileiro.
 *
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado como moeda (ex: "R$ 1.234,56")
 *
 * @example
 * formataMoeda(1234.56) // "R$ 1.234,56"
 * formataMoeda(1000000) // "R$ 1.000.000,00"
 */
export function formataMoeda(valor) {
  if (valor == null || isNaN(valor)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata data brasileira para o formato aceito por inputs Vuetify (v-date-picker)
 *
 * Os componentes de data do Vuetify esperam o formato ISO (yyyy-MM-dd).
 * Esta função converte datas no formato brasileiro "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm:ss"
 * para o formato esperado pelo Vuetify.
 *
 * Realiza validações para garantir que a string possui os componentes necessários
 * (dia, mês, ano) antes de fazer a conversão.
 *
 * @param {string} dataString - Data no formato brasileiro (ex: "26/02/2025" ou "26/02/2025 00:00:00")
 * @returns {string|null} Data no formato ISO (ex: "2025-02-26") ou null se inválida
 *
 * @example
 * formatarDataParaInputVuetify("26/02/2025") // "2025-02-26"
 * formatarDataParaInputVuetify("26/02/2025 14:30:00") // "2025-02-26"
 * formatarDataParaInputVuetify("5/3/2025") // "2025-03-05" (adiciona zeros)
 * formatarDataParaInputVuetify("") // null
 */
export function formatarDataParaInputVuetify(dataString) {
  if (typeof dataString !== 'string' || dataString.trim() === '') {
    return null;
  }

  // Tenta extrair a parte da data antes do espaço
  const partes = dataString.split(' ');
  if (partes.length === 0) {
    return null;
  }

  const dataParte = partes[0]; // "26/02/2025"
  const [dia, mes, ano] = dataParte.split('/');

  // Verifica se dia, mes e ano existem e são strings válidas
  if (!dia || !mes || !ano) {
    return null;
  }

  // Garante que mês e dia tenham 2 dígitos
  const diaFormatado = dia.padStart(2, '0');
  const mesFormatado = mes.padStart(2, '0');

  return `${ano}-${mesFormatado}-${diaFormatado}`;
}

