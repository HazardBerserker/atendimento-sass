export function extraiValorDaPrimeiraPropDoObjeto(obj) {
  const [chave] = Object.keys(obj);
  const { [chave]: valor } = obj;
  return valor
}
