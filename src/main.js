
import { createApp } from 'vue'
import { Quasar,Notify } from 'quasar'
import { createPinia } from 'pinia';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/themify/themify.css'
import '@quasar/extras/line-awesome/line-awesome.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'
import VueCountdown from '@chenfengyuan/vue-countdown';
//import { createPinia } from 'pinia'
// Import Quasar css
import 'quasar/src/css/index.sass'
import router from '../src/router'
// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'



const pinia = createPinia();

const myApp = createApp(App)
myApp.use(router)
myApp.use(pinia);
//myApp.use(createPinia())
myApp.component(VueCountdown.name, VueCountdown);

myApp.use(Quasar, {
  plugins: {
    Notify
  },
  config: {
    notify:Notify /* look at QuasarConfOptions from the API card */
  }
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
