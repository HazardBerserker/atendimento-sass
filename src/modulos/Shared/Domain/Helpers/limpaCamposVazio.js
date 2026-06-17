export function limparCamposVazios(objeto) {
  if (Array.isArray(objeto)) {
    return objeto
      .map(item => limparCamposVazios(item))
      .filter(item => !isValorVazio(item));
  }

  if (typeof objeto === 'object' && objeto !== null) {
    const novoObjeto = {};

    for (const chave in objeto) {
      const valor = limparCamposVazios(objeto[chave]);

      if (!isValorVazio(valor)) {
        novoObjeto[chave] = valor;
      }
    }

    return Object.keys(novoObjeto).length > 0 ? novoObjeto : null;
  }

  return objeto;
}

function isValorVazio(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === '' ||
    (Array.isArray(valor) && valor.length === 0)
  ) {
    return true;
  }

  if (typeof valor === 'object' && valor !== null) {
    const valoresInternos = Object.values(valor).map(v => limparCamposVazios(v));
    return valoresInternos.every(isValorVazio);
  }

  return false;
}
