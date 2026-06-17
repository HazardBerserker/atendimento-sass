<template>
    <div class="w-100">
      <!-- Modo Seletor Agrupado -->
      <div v-if="enableSelector" class="smart-selector-text">
        <v-badge color="white" transition="slide-x-transition" style="width: 100%;" :floating="overlap" v-if="ajudaMensagem">
          <template v-if="ajudaMensagem" v-slot:badge>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon color="green" v-bind="props" small>mdi-help</v-icon>
              </template>
              <span v-html="ajudaMensagem"></span>
            </v-tooltip>
          </template>

          <v-menu
            v-model="selectorMenuOpen"
            :close-on-content-click="false"
            location="bottom"
            max-height="450"
            width="400"
          >
            <template #activator="{ props: menuProps }">
              <v-text-field
                v-bind="menuProps"
                :variant="variant"
                :density="density"
                :model-value="selectorDisplayValue"
                :rules="rules"
                :label="label"
                :disabled="disabled"
                :bg-color="bgColor"
                :color="color"
                :icon-color="iconColor"
                :append-inner-icon="appendInnerIcon"
                :base-color="baseColor"
                :readonly="true"
                :hide-details="rules.length != 0 ? false : hideDetails"
                @click:clear="limparSelecaoSelector"
                :clearable="clearable"
              >
                <template #prepend-inner>
                  <v-fade-transition>
                    <v-tooltip location="top" v-if="enableGrouping">
                      <template #activator="{ props: tooltipProps }">
                        <v-btn
                          v-bind="tooltipProps"
                          :color="selectorModoAgrupado ? 'primary' : 'grey'"
                          :variant="selectorModoAgrupado ? 'flat' : 'text'"
                          size="x-small"
                          icon
                          @click.stop="toggleSelectorModoAgrupado"
                        >
                          <v-icon size="16">{{
                            selectorModoAgrupado ? "mdi-group" : "mdi-format-list-bulleted"
                          }}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{
                        selectorModoAgrupado ? "Listar Todos" : "Agrupar por Categoria"
                      }}</span>
                    </v-tooltip>
                  </v-fade-transition>
                </template>

                <template #append-inner>
                  <v-fade-transition>
                    <v-icon class="selector-chevron-icon" v-if="selectorMenuOpen">
                      mdi-chevron-up
                    </v-icon>
                    <v-icon class="selector-chevron-icon" v-else>
                      mdi-chevron-down
                    </v-icon>
                  </v-fade-transition>
                </template>
              </v-text-field>
            </template>

            <v-card class="selector-dropdown-card">
              <!-- Busca Interna -->
              <v-card-text class="pa-2">
                <v-text-field
                  v-model="selectorSearchTerm"
                  :color="color"
                  :icon-color="iconColor"
                  :append-inner-icon="appendInnerIcon"
                  :base-color="baseColor"
                  density="compact"
                  variant="outlined"
                  placeholder="Buscar..."
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                />
              </v-card-text>

              <v-divider />

              <!-- Modo Normal: Lista Simples -->
              <v-fade-transition>
                <div v-if="!selectorModoAgrupado || !enableGrouping" class="selector-list-container">
                  <v-virtual-scroll
                    :items="selectorItemsFiltrados"
                    :height="300"
                    item-height="40"
                    :key="`virtual-scroll-${selectorSelectedItemsKey}`"
                  >
                    <template #default="{ item }">
                      <v-list-item
                        :key="item"
                        @click="toggleSelectorItem(item)"
                        :active="isSelectorItemSelected(item)"
                        density="compact"
                      >
                        <template #prepend>
                          <v-checkbox-btn
                            :model-value="isSelectorItemSelected(item)"
                            color="primary"
                            hide-details
                            density="compact"
                            @click.stop
                          />
                        </template>
                        <v-list-item-title class="text-body-2">{{ item }}</v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </div>
                <!-- Modo Agrupado -->
                <div v-else class="selector-list-container">
                  <v-list density="compact" class="pa-0" :key="`grouped-list-${selectorSelectedItemsKey}`">
                    <div
                      v-for="(items, groupName) in selectorGruposFiltrados"
                      :key="`grupo-${groupName}`"
                      class="selector-grupo-container"
                    >
                      <!-- Cabeçalho do Grupo -->
                      <v-list-item
                        @click="toggleSelectorGrupo(groupName)"
                        class="selector-grupo-header"
                        :class="{ 'selector-grupo-expandido': selectorGrupoExpandido[groupName] }"
                        density="compact"
                      >
                        <template #prepend>
                          <v-checkbox-btn
                            :model-value="isSelectorGrupoSelected(items)"
                            :indeterminate="isSelectorGrupoParcialmenteSelecionado(items)"
                            @click.stop="toggleSelectorGrupoCompleto(items)"
                            color="primary"
                            hide-details
                            density="compact"
                          />
                        </template>
                        <template #title>
                          <div class="d-flex align-items-center">
                            <v-icon size="small" class="mr-1" color="primary">{{ selectorGroupIcon }}</v-icon>
                            <span class="text-body-2 font-weight-bold">{{ groupName }}</span>
                            <v-chip size="x-small" class="ml-2" color="primary" variant="tonal">{{ items.length }}</v-chip>
                          </div>
                        </template>
                        <template #append>
                          <v-icon size="small">
                            {{ selectorGrupoExpandido[groupName] ? "mdi-chevron-up" : "mdi-chevron-down" }}
                          </v-icon>
                        </template>
                      </v-list-item>
                      <!-- Membros do Grupo -->
                      <v-expand-transition>
                        <div v-if="selectorGrupoExpandido[groupName]" class="selector-membros-container">
                          <v-list-item
                            v-for="item in items"
                            :key="`membro-${item}`"
                            @click="toggleSelectorItem(item)"
                            :active="isSelectorItemSelected(item)"
                            density="compact"
                            class="selector-membro-item"
                          >
                            <template #prepend>
                              <v-checkbox-btn
                                :model-value="isSelectorItemSelected(item)"
                                color="primary"
                                hide-details
                                density="compact"
                                @click.stop
                              />
                            </template>
                            <v-list-item-title class="text-caption">{{ item }}</v-list-item-title>
                          </v-list-item>
                        </div>
                      </v-expand-transition>
                    </div>
                  </v-list>
                </div>
              </v-fade-transition>

              <!-- Rodapé com Ações -->
              <v-divider />
              <v-card-actions class="pa-2">
                <v-btn
                  v-if="selectorSelectedCount > 0"
                  size="small"
                  color="error"
                  variant="text"
                  @click="limparSelecaoSelector"
                >
                  Limpar ({{ selectorSelectedCount }})
                </v-btn>
                <v-spacer />
                <v-btn
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="selectorMenuOpen = false"
                >
                  Fechar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-badge>

        <!-- Sem badge de ajuda -->
        <v-menu
          v-else
          v-model="selectorMenuOpen"
          :close-on-content-click="false"
          location="bottom"
          max-height="450"
          width="400"
        >
          <template #activator="{ props: menuProps }">
            <v-text-field
              v-bind="menuProps"
              :variant="variant"
              :density="density"
              :model-value="selectorDisplayValue"
              :rules="rules"
              :label="label"
              :disabled="disabled"
              :bg-color="bgColor"
              :color="color"
              :icon-color="iconColor"
              :append-inner-icon="appendInnerIcon"
              :base-color="baseColor"
              :readonly="true"
              :hide-details="rules.length != 0 ? false : hideDetails"
              @click:clear="limparSelecaoSelector"
              :clearable="clearable"
            >
              <template #prepend-inner>
                <v-tooltip location="top" v-if="enableGrouping">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      :color="selectorModoAgrupado ? 'primary' : 'grey'"
                      :variant="selectorModoAgrupado ? 'flat' : 'text'"
                      size="x-small"
                      icon
                      @click.stop="toggleSelectorModoAgrupado"
                    >
                      <v-icon size="16">{{
                        selectorModoAgrupado ? "mdi-group" : "mdi-format-list-bulleted"
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{
                    selectorModoAgrupado ? "Listar Todos" : "Agrupar por Categoria"
                  }}</span>
                </v-tooltip>
              </template>

              <template #append-inner>
                <v-fade-transition hide-on-leave>
                  <v-icon class="selector-chevron-icon" v-if="selectorMenuOpen">
                    mdi-chevron-up
                  </v-icon>
                  <v-icon class="selector-chevron-icon" v-else>
                    mdi-chevron-down
                  </v-icon>
                </v-fade-transition>
              </template>
            </v-text-field>
          </template>

          <v-card class="selector-dropdown-card">
            <!-- Busca Interna -->
            <v-card-text class="pa-2">
              <v-text-field
                v-model="selectorSearchTerm"
                :color="color"
                :icon-color="iconColor"
                :append-inner-icon="appendInnerIcon"
                :base-color="baseColor"
                density="compact"
                variant="outlined"
                placeholder="Buscar..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              />
            </v-card-text>

            <v-divider />

            <!-- Modo Normal: Lista Simples -->
            <div v-if="!selectorModoAgrupado || !enableGrouping" class="selector-list-container">
              <v-virtual-scroll
                :items="selectorItemsFiltrados"
                :height="300"
                item-height="40"
                :key="`virtual-scroll-${selectorSelectedItemsKey}`"
              >
                <template #default="{ item }">
                  <v-list-item
                    :key="item"
                    @click="toggleSelectorItem(item)"
                    :active="isSelectorItemSelected(item)"
                    density="compact"
                  >
                    <template #prepend>
                      <v-checkbox-btn
                        :model-value="isSelectorItemSelected(item)"
                        color="primary"
                        hide-details
                        density="compact"
                        @click.stop
                      />
                    </template>
                    <v-list-item-title class="text-body-2">{{ item }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-virtual-scroll>
            </div>

            <!-- Modo Agrupado -->
            <div v-else class="selector-list-container">
              <v-list density="compact" class="pa-0" :key="`grouped-list-${selectorSelectedItemsKey}`">
                <div
                  v-for="(items, groupName) in selectorGruposFiltrados"
                  :key="`grupo-${groupName}`"
                  class="selector-grupo-container"
                >
                  <!-- Cabeçalho do Grupo -->
                  <v-list-item
                    @click="toggleSelectorGrupo(groupName)"
                    class="selector-grupo-header"
                    :class="{ 'selector-grupo-expandido': selectorGrupoExpandido[groupName] }"
                    density="compact"
                  >
                    <template #prepend>
                      <v-checkbox-btn
                        :model-value="isSelectorGrupoSelected(items)"
                        :indeterminate="isSelectorGrupoParcialmenteSelecionado(items)"
                        @click.stop="toggleSelectorGrupoCompleto(items)"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </template>
                    <template #title>
                      <div class="d-flex align-items-center">
                        <v-icon size="small" class="mr-1" color="primary">{{ selectorGroupIcon }}</v-icon>
                        <span class="text-body-2 font-weight-bold">{{ groupName }}</span>
                        <v-chip size="x-small" class="ml-2" color="primary" variant="tonal">{{ items.length }}</v-chip>
                      </div>
                    </template>
                    <template #append>
                      <v-fade-transition hide-on-leave>
                        <v-icon size="small" v-if="selectorGrupoExpandido[groupName]">
                          mdi-chevron-up
                        </v-icon>
                        <v-icon size="small" v-else>
                          mdi-chevron-down
                        </v-icon>
                      </v-fade-transition>
                    </template>
                  </v-list-item>

                  <!-- Membros do Grupo -->
                  <v-expand-transition>
                    <div v-if="selectorGrupoExpandido[groupName]" class="selector-membros-container">
                      <v-list-item
                        v-for="item in items"
                        :key="`membro-${item}`"
                        @click="toggleSelectorItem(item)"
                        :active="isSelectorItemSelected(item)"
                        density="compact"
                        class="selector-membro-item"
                      >
                        <template #prepend>
                          <v-checkbox-btn
                            :model-value="isSelectorItemSelected(item)"
                            color="primary"
                            hide-details
                            density="compact"
                            @click.stop
                          />
                        </template>
                        <v-list-item-title class="text-caption">{{ item }}</v-list-item-title>
                      </v-list-item>
                    </div>
                  </v-expand-transition>
                </div>
              </v-list>
            </div>

            <!-- Rodapé com Ações -->
            <v-divider />
            <v-card-actions class="pa-2">
              <v-btn
                v-if="selectorSelectedCount > 0"
                size="small"
                color="error"
                variant="text"
                @click="limparSelecaoSelector"
              >
                Limpar ({{ selectorSelectedCount }})
              </v-btn>
              <v-spacer />
              <v-btn
                size="small"
                color="primary"
                variant="tonal"
                @click="selectorMenuOpen = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <!-- Modo InputText Normal (existente) -->
      <v-badge v-else-if="ajudaMensagem" color="white" transition="slide-x-transition" style="width: 100%;" :floating="overlap">
      <!-- Badge com tooltip de ajuda -->
        <template v-if="ajudaMensagem" v-slot:badge>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                  <v-icon color="green" v-bind="props" small>
                      mdi-help
                  </v-icon>
              </template>
              <span v-html="ajudaMensagem"></span>
          </v-tooltip>
        </template>

        <v-text-field
          :variant="variant"
          :density="density"
          v-model="modelProxy"
          :rules="rules"
          :counter="counter"
          :label="label"
          :disabled="disabled"
          :type="type"
          :maxLength="counter"
          :append-icon="appendIcon"
          :prepend-icon="prependIcon"
          :bg-color="bgColor"
          :color="color"
          :icon-color="iconColor"
          :append-inner-icon="appendInnerIcon"
          :base-color="baseColor"
          :clearable="clearable"
          hide-spin-buttons
          :readonly="readonly"
          @update:focused="acionaBlur"
          :hide-details="rules.length != 0 ? false : hideDetails"
        >
          <template #prepend-inner>
            {{ prependInnerIcon }}
          </template>
        </v-text-field>
      </v-badge>

      <v-text-field
        v-else
        :variant="variant"
        :density="density"
        v-model="modelProxy"
        :rules="rules"
        :counter="counter"
        :label="label"
        :disabled="disabled"
        :type="type"
        :maxLength="counter"
        :append-icon="appendIcon"
        :prepend-icon="prependIcon"
        :bg-color="bgColor"
        :color="color"
        :icon-color="iconColor"
        :append-inner-icon="appendInnerIcon"
        :base-color="baseColor"
        :clearable="clearable"
        hide-spin-buttons
        :readonly="readonly"
        @update:focused="acionaBlur"
        :hide-details="rules.length != 0 ? false : hideDetails"
      >
        <template #prepend-inner>
          {{ prependInnerIcon }}
        </template>
      </v-text-field>
    </div>

</template>

<script>

export default {
    name: 'InputText',
    props: {
        modelValue: {
          type: [String, Number, Array],
          default: ''
        },
        rules: {
          type: Array,
          default: () => []
        },
        counter: {
          type: [Number, String],
          default: null
        },
        label: {
          type: String,
          default: ''
        },
        disabled: {
          type: Boolean,
          default: false
        },
        mask: {
          type: String,
          default: ''
        },
        type: {
          type: String,
          default: 'text'
        },
        appendIcon: {
          type: String,
          default: ''
        },
        prependIcon: {
          type: String,
          default: ''
        },
        prependInnerIcon: {
          type: String,
          default: null
        },
        estiloCampo: {
          type: String,
          default: 'outlined'
        },
        clickAppend: {
          type: Function,
          default: () => null
        },
        bgColor: {
          type: String,
          default: null
        },
        color: {
          type: String,
          default: null
        },
        iconColor: {
          type: String,
          default: null
        },
        appendInnerIcon: {
          type: String,
          default: null
        },
        baseColor: {
          type: String,
          default: null
        },
        ajudaMensagem: {
          type: String,
          default: null
        },
        clearable: {
          type: Boolean,
          default: true
        },
        floating: {
          type: Boolean,
          default: false
        },
        readonly: {
          type: Boolean,
          default: false
        },
        hideDetails: {
          type: Boolean,
          default: true
        },
        emiteCampoComFormatacaoAplicada: {
          type: Boolean,
          default: false
        },
        variant: {
          type: String,
          default: 'outlined'
        },
        density: {
          type: String,
          default: 'comfortable'
        },
        // Props para modo Seletor Agrupado
        enableSelector: {
          type: Boolean,
          default: false
        },
        selectorItems: {
          type: Array,
          default: () => []
        },
        selectorGroupedItems: {
          type: Object,
          default: () => ({})
        },
        enableGrouping: {
          type: Boolean,
          default: false
        },
        selectorGroupIcon: {
          type: String,
          default: 'mdi-folder'
        },
        selectorDisplayFormat: {
          type: String,
          default: 'count' // 'count' | 'list' | 'custom'
        }
    },

    data() {
      return {
        // Estado do modo selector
        selectorMenuOpen: false,
        selectorModoAgrupado: false,
        selectorSearchTerm: "",
        selectorGrupoExpandido: {},
        selectorSelectedItems: []
      }
    },

    mounted() {
      // Inicialização do modo selector
      if (this.enableSelector && this.modelValue && Array.isArray(this.modelValue)) {
        this.selectorSelectedItems = [...this.modelValue];
        this.$forceUpdate();
      }

      // Define modo agrupado como padrão quando enableGrouping for true
      if (this.enableSelector && this.enableGrouping) {
        this.selectorModoAgrupado = true;
      }
    },

    computed: {
      overlap() {
        return !!this.floating;
      },

      modelProxy: {
        get() {
          // Se for modo selector, retorna o valor formatado do selector
          if (this.enableSelector) {
            return this.selectorDisplayValue;
          }

          // Modo normal: retorna o valor mascarado SOMENTE para exibição no input
          if (this.mask && this.modelValue) {
            return this.$VMask(this.modelValue, this.mask);
          }
          return this.modelValue;
        },

        set(valorDigitado) {
          // Se for modo selector, não processa mudanças (readonly)
          if (this.enableSelector) {
            return;
          }

          let valorInterno = valorDigitado;

          if(this.emiteCampoComFormatacaoAplicada) {
              this.$emit('update:modelValue', valorInterno);
              return;
          }

          if(this.mask && valorDigitado) {
              valorInterno = valorDigitado.replace(/\D+/g, '');
          }
          // Remove a máscara antes de emitir

          this.$emit('update:modelValue', valorInterno);
        },
      },

      // === Computeds do Modo Selector ===

      /**
       * Valor exibido no campo quando em modo selector
       */
      selectorDisplayValue() {
        if (!this.enableSelector || this.selectorSelectedItems.length === 0) {
          return '';
        }

        const count = this.selectorSelectedItems.length;

        switch (this.selectorDisplayFormat) {
          case 'count':
            return count === 1 ? '1 item selecionado' : `${count} itens selecionados`;

          case 'list':
            if (count <= 3) {
              return this.selectorSelectedItems.join(', ');
            }
            return `${this.selectorSelectedItems.slice(0, 2).join(', ')} (+${count - 2} outros)`;

          case 'custom':
            return this.formatSelectorDisplay ? this.formatSelectorDisplay(this.selectorSelectedItems) : this.selectorSelectedItems.join(', ');

          default:
            return `${count} selecionado${count > 1 ? 's' : ''}`;
        }
      },

      /**
       * Chave reativa para forçar atualização dos componentes filhos
       */
      selectorSelectedItemsKey() {
        return this.selectorSelectedItems.length + '-' + this.selectorSelectedItems.join(',');
      },

      /**
       * Quantidade de itens selecionados
       */
      selectorSelectedCount() {
        return this.selectorSelectedItems.length;
      },

      /**
       * Lista flatten de todos os itens disponíveis
       */
      selectorTodosOsItensDisponiveis() {
        if (this.enableGrouping && Object.keys(this.selectorGroupedItems).length > 0) {
          return Object.values(this.selectorGroupedItems).flat();
        }
        return this.selectorItems || [];
      },

      /**
       * Itens filtrados para modo lista simples
       */
      selectorItemsFiltrados() {
        if (!this.selectorSearchTerm) return this.selectorTodosOsItensDisponiveis;

        const termo = this.selectorSearchTerm.toLowerCase();
        return this.selectorTodosOsItensDisponiveis.filter((item) =>
          item.toLowerCase().includes(termo)
        );
      },

      /**
       * Grupos filtrados para modo agrupado
       */
      selectorGruposFiltrados() {
        if (!this.enableGrouping) return {};

        const grupos = this.selectorGroupedItems || {};

        if (!this.selectorSearchTerm) return grupos;

        const termo = this.selectorSearchTerm.toLowerCase();
        const gruposFiltrados = {};

        Object.entries(grupos).forEach(([nomeGrupo, itens]) => {
          const nomeGrupoMatch = nomeGrupo.toLowerCase().includes(termo);
          const itensFiltrados = itens.filter(item =>
            item.toLowerCase().includes(termo)
          );

          if (nomeGrupoMatch || itensFiltrados.length > 0) {
            gruposFiltrados[nomeGrupo] = nomeGrupoMatch ? itens : itensFiltrados;
          }
        });

        // Auto-expandir grupos durante busca
        if (termo && this.selectorModoAgrupado) {
          Object.keys(gruposFiltrados).forEach((nomeGrupo) => {
            if (!this.selectorGrupoExpandido[nomeGrupo]) {
              this.selectorGrupoExpandido[nomeGrupo] = true;
            }
          });
        }

        return gruposFiltrados;
      }
    },

    watch: {
      modelValue: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // Sincronizar selectorSelectedItems com modelValue quando em modo selector
          if (this.enableSelector) {
            const newArray = Array.isArray(newVal) ? [...newVal] : [];
            const currentStr = JSON.stringify([...this.selectorSelectedItems].sort());
            const newStr = JSON.stringify([...newArray].sort());

            if (currentStr !== newStr) {
              this.selectorSelectedItems = newArray;
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        },
      },
    },

    methods: {
      acionaBlur() {
          this.$emit('onBlur')
      },

      estilo(estiloDefinido) {
          return this.estiloCampo === estiloDefinido;
      },

      // === Métodos do Modo Selector ===

      /**
       * Alterna modo de visualização entre lista simples e agrupada
       */
      toggleSelectorModoAgrupado() {
        this.selectorModoAgrupado = !this.selectorModoAgrupado;
        if (!this.selectorModoAgrupado) {
          this.selectorGrupoExpandido = {};
        }
      },

      /**
       * Expande/colapsa um grupo específico
       */
      toggleSelectorGrupo(nomeGrupo) {
        this.selectorGrupoExpandido[nomeGrupo] = !this.selectorGrupoExpandido[nomeGrupo];
      },

      /**
       * Seleciona/deseleciona um item individual
       */
      toggleSelectorItem(item) {
        const index = this.selectorSelectedItems.indexOf(item);
        if (index > -1) {
          this.selectorSelectedItems.splice(index, 1);
        } else {
          this.selectorSelectedItems.push(item);
        }

        // Emitir array flatten
        this.$emit("update:modelValue", [...this.selectorSelectedItems]);
        this.$forceUpdate();
      },

      /**
       * Verifica se um item específico está selecionado
       */
      isSelectorItemSelected(item) {
        return this.selectorSelectedItems.includes(item);
      },

      /**
       * Seleciona/deseleciona todos os itens de um grupo
       */
      toggleSelectorGrupoCompleto(itensDoGrupo) {
        const todosSelecionados = itensDoGrupo.every((item) =>
          this.selectorSelectedItems.includes(item)
        );

        if (todosSelecionados) {
          // Desselecionar todos os itens do grupo
          itensDoGrupo.forEach((item) => {
            const index = this.selectorSelectedItems.indexOf(item);
            if (index > -1) {
              this.selectorSelectedItems.splice(index, 1);
            }
          });
        } else {
          // Selecionar todos os itens do grupo
          itensDoGrupo.forEach((item) => {
            if (!this.selectorSelectedItems.includes(item)) {
              this.selectorSelectedItems.push(item);
            }
          });
        }

        this.$emit("update:modelValue", [...this.selectorSelectedItems]);
        this.$forceUpdate();
      },

      /**
       * Verifica se todos os itens de um grupo estão selecionados
       */
      isSelectorGrupoSelected(itensDoGrupo) {
        return itensDoGrupo.every((item) =>
          this.selectorSelectedItems.includes(item)
        );
      },

      /**
       * Verifica se um grupo está parcialmente selecionado
       */
      isSelectorGrupoParcialmenteSelecionado(itensDoGrupo) {
        const algunsSelecionados = itensDoGrupo.some((item) =>
          this.selectorSelectedItems.includes(item)
        );
        const todosSelecionados = itensDoGrupo.every((item) =>
          this.selectorSelectedItems.includes(item)
        );

        return algunsSelecionados && !todosSelecionados;
      },

      /**
       * Limpa toda a seleção do selector
       */
      limparSelecaoSelector() {
        this.selectorSelectedItems = [];
        this.$emit("update:modelValue", []);
        this.$forceUpdate();
      }
  }
};
</script>

<style scoped>
/* === Estilos do Modo Selector === */
.smart-selector-text {
  width: 100%;
}

.selector-dropdown-card {
  max-width: 400px;
}

.selector-list-container {
  max-height: 300px;
  overflow-y: auto;
}

.selector-grupo-container {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.selector-grupo-header {
  cursor: pointer;
  background: rgba(25, 118, 210, 0.02);
  transition: all 0.2s ease;
}

.selector-grupo-header:hover {
  background: rgba(25, 118, 210, 0.06);
}

.selector-grupo-expandido {
  background: rgba(25, 118, 210, 0.08) !important;
  border-left: 3px solid #1976d2;
}

.selector-membros-container {
  background: rgba(0, 0, 0, 0.02);
  padding-left: 16px;
}

.selector-membro-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.selector-membro-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

</style>
