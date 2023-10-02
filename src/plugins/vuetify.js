import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { VDataIterator } from 'vuetify/labs/VDataIterator'

export default createVuetify({
    components: {
      VDataTable,
      VDataTableServer,
      VDataIterator
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#E53935',
              secondary: '#FFCDD2'
            }
          },
        },
      },
  })