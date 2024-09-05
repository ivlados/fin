import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//Add all icons to the library so you can use it in your page
library.add(fas)


createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
