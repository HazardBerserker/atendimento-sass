<template>
    <div class="w-100">
        <v-badge color="white" transition="slide-x-transition" style="width: 100%;" :floating="floating" v-if="ajudaMensagem">
            <!-- Slot do badge para exibir ícone de ajuda com tooltip -->
            <template v-if="ajudaMensagem" v-slot:badge>
                <v-tooltip v-if="ajudaMensagem" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-icon color="green" v-bind="props" small>
                            mdi-help
                        </v-icon>
                    </template>
                    <span v-html="ajudaMensagem"></span>
                </v-tooltip>
            </template>
            <v-text-field v-model="modelValueLocal" :bg-color="bgColor" @keypress="onlyNumber" :hide-details="hideDetails" :label="label" :variant="variant" :density="density" :rules="rules" validate-on-blur :maxlength="contador" :disabled="disabled" :clearable="clearable" :readonly="readonly">
                <template #prepend-inner>
                  {{ prefix }}
                </template>

                <template #append-inner>
                    {{sufix}}
                </template>
            </v-text-field>
        </v-badge>
        <v-text-field v-else v-model="modelValueLocal" :bg-color="bgColor" @keypress="onlyNumber" :hide-details="hideDetails" :label="label" :variant="variant" :density="density" :rules="rules" validate-on-blur :maxlength="contador" :disabled="disabled" :clearable="clearable" :readonly="readonly">
            <template #prepend-inner>
              {{ prefix }}
            </template>

            <template #append-inner>
                {{sufix}}
            </template>
        </v-text-field>
    </div>
</template>

<script>
  import { format, unformat } from 'v-money3'

  export default {
    name: 'InputTextMoeda',
    props: {
        modelValue: {
            type: [Number, String],
            default: null,
        },
        label: {
            type: String,
            default: ''
        },
        prefix: {
            type: String,
            default: '',
        },
        sufix: {
            type: String,
            default: '',
        },
        disableNegative: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        min: {
            type: [Number, Boolean],
            default: false,
        },
        max: {
            type: [Number, Boolean],
            default: false,
        },
        allowBlank: {
            type: Boolean,
            default: false
        },
        shouldRound: {
            type: Boolean,
            default: true,
        },
        ajudaMensagem: {
            type: String,
            default: null
        },
        rules: {
            type: Array,
            default: () => []
        },
        contador: {
            type: Number,
            default: null
        },
        floating: {
            type: Boolean,
            default: false
        },
        casasDecimais: {
            type: Number,
            default: 2
        },
        permitirZero: {
            type: Boolean,
            default: false
        },
        variant: {
          type: String,
          default: 'outlined'
        },
        readonly: {
          type: Boolean,
          default: false
        },
        density: {
          type: String,
          default: 'compact'
        },
        bgColor: {
          type: String,
          default: null
        },
        clearable: {
          type: Boolean,
          default: false,
        },
        hideDetails: {
          type: Boolean,
          default: false,
        }
    },
    data () {
      return {
        config: {
          masked: false,
          prefix: '',
          suffix: this.sufix,
          thousands: '.',
          decimal: ',',
          precision: this.casasDecimais,
          disableNegative: this.disableNegative,
          min: this.min,
          max: this.max,
          allowBlank: this.allowBlank,
          minimumNumberOfCharacters: 0,
          shouldRound: this.shouldRound,
          focusOnRight: false,
        }
      }
    },
    computed: {
      modelValueLocal: {
        get() {
            if (this.modelValue === null || this.modelValue === undefined || this.modelValue === 0 && !this.disabled && !this.permitirZero) {
                return null
            }
            const modelValue = this.modelValue
            const modelValueFormatado = format(modelValue, this.config)
            return modelValueFormatado
        },
        set(value) {
            if(this.permitirZero && value === '0') {
                this.$emit('update:modelValue', 0);
                return;
            }

            if (!value || value === '') {
                this.$emit('update:modelValue', null);
                return;
            }
            const valorSemFormatacao = unformat(value, this.config)
            const valorFloat = parseFloat(valorSemFormatacao);
            this.$emit('update:modelValue', valorFloat);
        }
      }
    },

    methods: {
        onlyNumber(e) {
            const char = String.fromCharCode(e.keyCode)
            if (!/[0-9]/.test(char)) {
            e.preventDefault()
            }
        }
    }
  }
</script>
