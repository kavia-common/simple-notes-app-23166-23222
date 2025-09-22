export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Ocean Notes',
      meta: [
        { name: 'description', content: 'A modern notes app with an Ocean Professional theme.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2563EB' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ],
      bodyAttrs: { class: 'font-sans' }
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Private runtime config
    apiSecret: '',
    public: {
      // PUBLIC_INTERFACE
      // Base URL for the backend API. Must be provided via environment variable NUXT_PUBLIC_API_BASE or defaults to /api.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000
    },
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      }
    }
  }
});
