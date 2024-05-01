import { createApp } from 'vue'
import App from './App.vue'
import PgKit from 'pg-kit'
import "pg-kit/dist/index.css"
// import './style.css'

createApp(App).use(PgKit).mount('#app')
