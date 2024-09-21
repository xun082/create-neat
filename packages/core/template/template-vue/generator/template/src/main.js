import { createApp } from 'vue'

import App from './App.vue'

<%_ if (VueEjs.usePinia === true) { _%>
import { createPinia } from 'pinia'

const pinia = createPinia()
<%_ } _%>

const app = createApp(App)

<%_ if (VueEjs.usePinia === true) { _%>
app.use(pinia)
<%_ } _%>

app.mount('#app')
