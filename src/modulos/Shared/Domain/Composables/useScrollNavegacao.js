import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollNavegacao() {
  const secaoAtiva = ref('upk-plano-vendas')
  let observer = null

  const configurarIntersectionObserver = () => {
    const opcoes = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Considera ativo quando está no terço superior da tela
      threshold: 0.1
    }

    observer = new IntersectionObserver((entradas) => {
      // Filtra apenas as entradas que estão visíveis
      const entradasVisiveis = entradas.filter(entrada => entrada.isIntersecting)

      if (entradasVisiveis.length > 0) {
        // Pega o elemento que está mais no topo
        const elementoMaisAlto = entradasVisiveis.reduce((anterior, atual) => {
          return anterior.boundingClientRect.top < atual.boundingClientRect.top ? anterior : atual
        })

        secaoAtiva.value = elementoMaisAlto.target.id
      }
    }, opcoes)

    // Lista de IDs das seções para observar
    const secoesParaObservar = [
      'upk-plano-vendas',
      'garantia-aftmkt',
      'frota-dados-gerais',
      'frota-pecas-uf',
      'frota-familia-pecas',
      'lista-ferramentas',
      'controle-estoque'
    ]

    // Observa cada seção
    secoesParaObservar.forEach(id => {
      const elemento = document.getElementById(id)
      if (elemento) {
        observer.observe(elemento)
      }
    })
  }

  const navegarParaSecao = (secaoId) => {
    secaoAtiva.value = secaoId

    const elemento = document.getElementById(secaoId)
    if (elemento) {
      const offsetTop = elemento.offsetTop - 100 // Considera altura do header

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  onMounted(() => {
    // Aguarda um tick para garantir que os elementos estão renderizados
    setTimeout(() => {
      configurarIntersectionObserver()
    }, 100)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    secaoAtiva,
    navegarParaSecao
  }
}
