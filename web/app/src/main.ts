import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import router from './router'
import { rootApi, setupApiInterceptors } from './api'

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'dev'

createApp(App)
  .use(router)
  .use(VueGtag, { config: { id: GA_MEASUREMENT_ID } }, router)
  .mount('#app')

setupApiInterceptors(rootApi)
