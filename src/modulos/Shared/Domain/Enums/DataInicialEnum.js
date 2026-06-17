export function gerarListaAnosDeAte1950() {
  const anoAtual = new Date().getFullYear();
  const anoMinimo = 1950;

  return Array.from({ length: anoAtual - anoMinimo + 1 }, (_, index) => {
    const ano = anoAtual - index;
    return { value: String(ano), text: String(ano) };
  });
}

export const anosDe1950AteAtual = gerarListaAnosDeAte1950();
