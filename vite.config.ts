import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";
import {PrimeVueResolver} from "unplugin-vue-components/resolvers";
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    chunkSizeWarningLimit: 600,
    outDir: resolve(__dirname, 'target/portable'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },

  },
  server: {
    host: 'portable.experiences',

    proxy: {
      '^\/[a-zA-z]*\/api\/[a-zA-z]*': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
      '^\/map\/[a-zA-Z]*.php$': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
      '^\/repository\/[a-zA-z]*': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
      '^\/server\/cron\/cron.php': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
      '^\/themes\/[a-zA-z]*': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
        '^\/server\/translation\/[a-z]*.json': {
        target: 'http://portable.experiences:8100',
        changeOrigin: true,
      },
    },
  },
  plugins: [
      vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })
  ],
})
