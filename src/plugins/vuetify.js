import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const vuetify = createVuetify({
  locale: {
    locale: 'pt',
    messages: { pt },
  },
   defaults: {
    global: {
      style: {
        fontFamily: 'Nunito, sans-serif'
      }
    },
    // Evita o reposicionamento da página ao abrir dialogs (efeito "espelho"
    // / deslocamento do fundo no mobile). O fundo apenas permanece estático.
    VDialog: {
      scrollStrategy: 'none'
    },
    VBtn: {
      style: {
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 600
      }
    },
    VCardTitle: {
      style: {
        fontFamily: 'Playfair Display, serif'
      }
    },
    VToolbarTitle: {
      style: {
        fontFamily: 'Playfair Display, serif'
      }
    }
  },
  components: {
    ...components,
    VDateInput,
    VFileUpload
  },
  directives,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      darkTheme: {
        dark: true,
        colors: {
          background: '#1E1A17',
          surface: '#29231E',

          laranjaAccentDarken: '#C9854A',
          laranjaAccent: '#E0A165',
          laranjaDarken2: '#E0A165',
          laranjaDarken1: '#E0A165',
          laranja: '#E0A165',
          laranjaLighten1: '#E6B077',
          laranjaLighten2: '#ECC08F',
          laranjaLighten3: '#ECC08F',
          laranjaLighten4: '#F0CB9F',
          laranjaLighten5: '#F2D2AB',

          white: '#29231E',
          whiteDarken1: '#322A23',
          whiteDarken2: '#352D25',
          whiteDarken3: '#3A322A',
          whiteDarken4: '#463C32',

          rosaAcento: '#D58A7F',
          rosaFundo: 'rgba(213,138,127,0.10)',

          success: '#4F9D72',
          warning: '#C68A3E',
          error: '#C9594F',
          info: '#5B7FB5',
        }
      },
      lightTheme: {
        dark: false,
        colors: {
          background: '#F4EEE6',
          surface: '#FCF9F5',

          laranjaAccentDarken: '#A9663A',
          laranjaAccent: '#C57F4B',
          laranjaDarken2: '#C57F4B',
          laranjaDarken1: '#CC8C50',
          laranja: '#C57F4B',
          laranjaLighten1: '#D29A66',
          laranjaLighten2: '#DDB084',
          laranjaLighten3: '#E3BD96',
          laranjaLighten4: '#E9C9A8',
          laranjaLighten5: '#EFD6BB',

          white: '#FCF9F5',
          whiteDarken1: '#F8F2EA',
          whiteDarken2: '#F3EBE0',
          whiteDarken3: '#EBE2D5',
          whiteDarken4: '#DFD3C2',

          rosaAcento: '#C16C61',
          rosaFundo: '#F9F0EE',

          success: '#4F9D72',
          warning: '#C68A3E',
          error: '#C9594F',
          info: '#5B7FB5',
        }
      }
    }
  }
})

export default vuetify
