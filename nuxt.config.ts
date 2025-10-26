// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  css: ['~/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:color" as color; @import "~/styles/_variables.scss"; @import "~/styles/_animations.scss"; @import "~/styles/_mixins.scss";',
          silenceDeprecations: ['import', 'global-builtin', 'color-functions']
        }
      }
    }
  }
})
