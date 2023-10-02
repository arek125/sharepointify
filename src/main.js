//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { useUserStore } from '@/stores/user'
import { useMainStore } from './stores/main'
import router from './router'

(async () => {
    const app = createApp(App)
    const pinia = createPinia()

    const mainUrl = 'https://petrosoft.sharepoint.com'
    app.provide('$mainUrl', mainUrl)
    app.provide('$window', window)
    //app.provide('$dj', dayjs)
    app.use(pinia)
	const userStore = useUserStore()
    await userStore.getUserData(mainUrl)

    app.use(vuetify)
    app.use(router)
    app.mount('#app')
    const mainStore = useMainStore()
    mainStore.getFormDigest()
})();
