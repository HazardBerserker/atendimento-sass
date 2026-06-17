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
          laranjaAccentDarken: '#D66236',
          laranjaAccent: '#EB6C3B',
          laranjaDarken2: '#D68B36',
          laranjaDarken1: '#EB993B',
          laranja: '#EAA83B',
          laranjaLighten1: '#ECB04D',
          laranjaLighten2: '#F0C06A',
          laranjaLighten3: '#F0BE6C',
          laranjaLighten4: '#F1C479',
          laranjaLighten5: '#F2C985',

          white: '#FFFFFF',
          whiteDarken1: '#FAFAFA',
          whiteDarken2: '#F5F5F5',
          whiteDarken3: '#EEEEEE',
          whiteDarken4: '#E5E5E5',

          rosaAcento: '#C96B64',
          rosaFundo: '#FFF8F7',
        }
      },
      lightTheme: {
        dark: false,
        colors: {
          laranjaAccentDarken: '#D66236',
          laranjaAccent: '#EB6C3B',
          laranjaDarken2: '#D68B36',
          laranjaDarken1: '#EB993B',
          laranja: '#EAA83B',
          laranjaLighten1: '#ECB04D',
          laranjaLighten2: '#F0C06A',
          laranjaLighten3: '#F0BE6C',
          laranjaLighten4: '#F1C479',
          laranjaLighten5: '#F2C985',

          white: '#FFFFFF',
          whiteDarken1: '#FAFAFA',
          whiteDarken2: '#F5F5F5',
          whiteDarken3: '#EEEEEE',
          whiteDarken4: '#E5E5E5',

          rosaAcento: '#C96B64',
          rosaFundo: '#FFF8F7',
        }
      }
    }
  }
})

export default vuetify
