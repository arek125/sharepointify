/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import components from 'unplugin-vue-components/vite'

/**
 * @param newFilename {string}
 * @returns {import('vite').Plugin}
 */
const renameIndexPlugin = newFilename => {
  if (!newFilename) return

  return {
    name: 'renameIndex',
    enforce: 'post',
    generateBundle(options, bundle) {
      const indexHtml = bundle['index.html']
      indexHtml.fileName = newFilename
    },
  }
}
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  console.log("mode: "+mode)
  const dev = mode == 'development'
  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      renameIndexPlugin('default.aspx'),
      components({ /* options */ })
    ],
    base : "./",
    define : {
      __VUE_PROD_DEVTOOLS__ : dev
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
