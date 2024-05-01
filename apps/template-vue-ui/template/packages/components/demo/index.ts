import { App, Plugin } from 'vue'
import Demo from './src/index.vue'

const DemoInstall: Plugin = {
  install(app: App) {
    app.component('Demo', Demo)
  }
}

export default DemoInstall

export {Demo}
