/**
 * Faz o download de um arquivo a partir de um blob
 *
 * @param {Blob} blob - Conteúdo binário do arquivo
 * @param {string} fileName - Nome do arquivo sugerido para download
 */
export function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
