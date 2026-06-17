import { SimENaoEnumDescricao } from "@/modulos/Shared/Domain/Enums/SimENaoEnum";

/**
 * Helper para obter configurações padrão de filtros por empresa
 * Cada empresa pode ter configurações específicas de agrupamento
 */
export const obterConfiguracoesPadraoPorEmpresa = (idEmpresa) => {
  // Configurações padrão por empresa
  const configuracoesPorEmpresa = {

    // MODEFER
    2: {
      tipo_veiculo: [ "Caminhões", "Ônibus" ],
      agrupar_por_ano_veiculo: SimENaoEnumDescricao.NAO,
      agrupar_por_motor: SimENaoEnumDescricao.NAO,
      agrupar_por_combustivel: SimENaoEnumDescricao.NAO,
      agrupar_por_numero_cilindros: SimENaoEnumDescricao.NAO,
      agrupar_por_valvulas_cilindro: SimENaoEnumDescricao.NAO,
      agrupar_por_cilindrada_litro: SimENaoEnumDescricao.NAO,
    },

    // VALPEC
    1: {
      tipo_veiculo: [ "Caminhões", "Ônibus" ],
      agrupar_por_ano_veiculo: SimENaoEnumDescricao.SIM,
      agrupar_por_motor: SimENaoEnumDescricao.SIM,
      agrupar_por_combustivel: SimENaoEnumDescricao.SIM,
      agrupar_por_numero_cilindros: SimENaoEnumDescricao.NAO,
      agrupar_por_valvulas_cilindro: SimENaoEnumDescricao.NAO,
      agrupar_por_cilindrada_litro: SimENaoEnumDescricao.NAO,
    },

    // HELLA
    3: {
      tipo_veiculo: [ "Automóveis e utilitários leves" ],
      agrupar_por_ano_veiculo: SimENaoEnumDescricao.SIM,
      agrupar_por_motor: SimENaoEnumDescricao.SIM,
      agrupar_por_combustivel: SimENaoEnumDescricao.SIM,
      agrupar_por_numero_cilindros: SimENaoEnumDescricao.SIM,
      agrupar_por_valvulas_cilindro: SimENaoEnumDescricao.SIM,
      agrupar_por_cilindrada_litro: SimENaoEnumDescricao.SIM,
    },

    // DELPHI
    4: {
      tipo_veiculo: [ "Automóveis e utilitários leves" ],
      agrupar_por_ano_veiculo: SimENaoEnumDescricao.SIM,
      agrupar_por_motor: SimENaoEnumDescricao.SIM,
      agrupar_por_combustivel: SimENaoEnumDescricao.SIM,
      agrupar_por_numero_cilindros: SimENaoEnumDescricao.SIM,
      agrupar_por_valvulas_cilindro: SimENaoEnumDescricao.SIM,
      agrupar_por_cilindrada_litro: SimENaoEnumDescricao.SIM,
    },

    // Adicione mais empresas conforme necessário
    // 4: { ... },
    // 5: { ... },
  };

  // Retorna as configurações da empresa específica ou as configurações padrão
  return configuracoesPorEmpresa[idEmpresa] || configuracoesPorEmpresa[2];
};
